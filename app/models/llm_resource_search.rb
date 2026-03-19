require 'uri'

class LlmResourceSearch
  CODE_HOSTS = %w[
    github.com
    gitlab.com
    bitbucket.org
    codeberg.org
    git.sr.ht
  ].freeze

  DATASET_HINTS = %w[
    zenodo
    figshare
    dryad
    dataverse
    kaggle
    pangaea
    osf.io
    mendeley
    dataset
    data
  ].freeze

  URL_REGEX = %r{https?://[^\s<>"']+}.freeze

  SearchResult = Struct.new(
    :paper,
    :resource_type,
    :resource_url,
    :resource_source,
    :score,
    :matches,
    keyword_init: true
  )

  def initialize(scope: Paper.unscoped.visible.order(accepted_at: :desc), query: nil, kind: nil, limit: 25)
    @scope = scope
    @query = query.to_s
    @kind = kind.to_s.presence
    @limit = limit
  end

  def call
    tokens = query_tokens
    rows = []

    @scope.each do |paper|
      resources_for(paper).each do |resource|
        next if @kind.present? && resource[:type] != @kind

        score, matches = score_for(paper, resource, tokens)
        next if tokens.any? && score <= 0

        rows << SearchResult.new(
          paper: paper,
          resource_type: resource[:type],
          resource_url: resource[:url],
          resource_source: resource[:source],
          score: score,
          matches: matches.uniq
        )
      end
    end

    rows
      .sort_by {|row| [-row.score, -(sort_time_for(row.paper).to_i)]}
      .first(@limit)
  end

  private

  def query_tokens
    @query
      .downcase
      .scan(/[a-z0-9\.\-_]+/)
      .uniq
  end

  def sort_time_for(paper)
    paper.accepted_at || paper.created_at || Time.at(0)
  end

  def resources_for(paper)
    resources = []

    if paper.repository_url.present?
      resources << {
        type: "code",
        url: normalize_url(paper.repository_url),
        source: "repository_url"
      }
    end

    if paper.archive_doi.present?
      resources << {
        type: "dataset",
        url: normalize_url(paper.archive_doi_url),
        source: "archive_doi"
      }
    end

    urls_from_text(paper.body).each do |url|
      type = classify_url(url)
      next unless type

      resources << {
        type: type,
        url: url,
        source: "body"
      }
    end

    resources.uniq {|resource| [resource[:type], resource[:url]]}
  end

  def score_for(paper, resource, tokens)
    return [1, ["recent"]] if tokens.empty?

    score = 0
    matches = []
    text = searchable_text_for(paper, resource)
    title = [paper.title, safe_scholar_title(paper)].compact.join(" ").downcase
    tags = safe_author_tags(paper).join(" ").downcase
    languages = safe_language_tags(paper).join(" ").downcase

    tokens.each do |token|
      if text.include?(token)
        score += 2
        matches << "paper metadata"
      end

      if title.include?(token)
        score += 4
        matches << "title"
      end

      if tags.include?(token)
        score += 3
        matches << "tags"
      end

      if languages.include?(token)
        score += 2
        matches << "languages"
      end

      if resource[:url].downcase.include?(token)
        score += 5
        matches << "resource url"
      end
    end

    if code_intent?(tokens) && resource[:type] == "code"
      score += 3
      matches << "code intent"
    end

    if dataset_intent?(tokens) && resource[:type] == "dataset"
      score += 3
      matches << "dataset intent"
    end

    [score, matches]
  end

  def searchable_text_for(paper, resource)
    [
      paper.title,
      safe_scholar_title(paper),
      safe_author_tags(paper).join(" "),
      safe_language_tags(paper).join(" "),
      safe_scholar_authors(paper),
      resource[:type],
      resource[:source],
      resource[:url]
    ].compact.join(" ").downcase
  end

  def normalize_url(value)
    value.to_s.strip.gsub(/["']/, "")
  end

  def urls_from_text(text)
    return [] if text.blank?

    text
      .scan(URL_REGEX)
      .map {|url| url.gsub(/[,\.\)\]]+\z/, "")}
      .uniq
  end

  def classify_url(url)
    downcased = url.downcase
    host = URI.parse(url).host.to_s.downcase

    return "code" if CODE_HOSTS.any? {|domain| host.include?(domain)}
    return "dataset" if DATASET_HINTS.any? {|hint| downcased.include?(hint)}

    nil
  rescue URI::InvalidURIError
    nil
  end

  def code_intent?(tokens)
    (tokens & %w[code repo repository github gitlab source software implementation]).any?
  end

  def dataset_intent?(tokens)
    (tokens & %w[data dataset datasets benchmark corpus archive zenodo figshare dryad]).any?
  end

  def safe_language_tags(paper)
    paper.language_tags
  rescue StandardError
    []
  end

  def safe_author_tags(paper)
    paper.author_tags
  rescue StandardError
    []
  end

  def safe_scholar_title(paper)
    paper.scholar_title
  rescue StandardError
    nil
  end

  def safe_scholar_authors(paper)
    paper.scholar_authors
  rescue StandardError
    nil
  end
end
