require "net/http"

module EvidenceHelper

# This method returns an html safe URL for the reproducible preprint (preprint.neurolibre.org/)
    def pretty_book_link(input_url)
        return input_url.scan(/"([^"]*)"/).join(', ').html_safe
    end

=begin
This method operates on a (class) paper instance variable (not a random input).
When added at the root directory of a NeuroLibre submission repository, `featured.png` is displayed in the paper card.
This method checks whether it exists on master/main branch, otherwise returns a placeholder.
=end
    def pretty_card_image(paper)    
        repo_name = paper.pretty_repository_name.gsub(/\s+/, "")
        user_image_main = "https://raw.githubusercontent.com/#{repo_name}/main/featured.png"
        user_image_master = "https://raw.githubusercontent.com/#{repo_name}/master/featured.png"
        if url_exist?(user_image_main)
          return user_image_main
        elsif url_exist?(user_image_master)
          return user_image_master
        else
          return "https://raw.githubusercontent.com/neurolibre/brand/main/png/pattern_dark.png"
        end
        
    end

=begin
This method populates the paper card with author information 
Depending on the existence of the authors data and links per author (e.g., personal webpage etc.)
=end
    def pretty_authors_card(authors)
        if authors.nil?
          return "".html_safe
        else
          fragment = []
          authors.each_with_index do |author, index|
            if index == 0
              fragment << "<strong>#{author_link_card(author)}</strong>"
            else
              fragment << author_link_card(author)
            end
          end
    
          return fragment.join(', ').html_safe
        end
    end
    
    def author_link_card(author)
        name = "#{author['given_name']} #{author['middle_name']} #{author['last_name']}".squish
        return name
    end

    # This method checks whether a provided URL exists.
    # Handles cant found cases both for the content (404) and server.
    def url_exist?(url_string)
        url = URI.parse(url_string)
        req = Net::HTTP.new(url.host, url.port)
        req.use_ssl = (url.scheme == 'https')
        path = url.path if url.path.present?
        res = req.request_head(path || '/')
        res.code != "404" # false if returns 404 - not found
      rescue Errno::ENOENT
        false # false if can't find the server
    end

    def doi_helper_nl(input_doi)
      return "DOI pending" unless input_doi
      bare_doi = input_doi[/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/]
      if input_doi.include?("https://doi.org/")
        return input_doi.gsub(/\"/, "")
      elsif bare_doi
        return "https://doi.org/#{bare_doi}".gsub(/\"/, "")
      else
        return input_doi.gsub(/\"/, "")
      end
    end

    def evidence_pretty_status_badge(paper)
        state = paper.state.gsub('_', ' ')
        badge_class = paper.state.gsub('_', '-')
    
        if state == "accepted"
          return content_tag(:span, "LIVING PREPRINT", class: "badge #{badge_class}")
        else
          return content_tag(:span, state, class: "badge #{badge_class}")
        end
    
      end
    
      def evidence_pretty_archive_badge(paper)
        state = paper.state.gsub('_', ' ')
    
        github_badge = paper.repository_doi ? link_to(content_tag(:span, icon('fa-brands', 'github'), class: "badge github"), paper.repository_doi,target: "_blank") : ""
        # book_badge = paper.book_doi ? link_to(content_tag(:span, icon('fa-solid', 'file-code'), class: "badge book"), paper.book_doi,target: "_blank") : ""
        data_badge = (paper.data_doi && paper.data_doi != "N/A") ? link_to(content_tag(:span, icon('fa-solid', 'database'), class: "badge data"), paper.data_doi,target: "_blank") : ""
        docker_badge = (paper.docker_doi && paper.docker_doi != "N/A") ? link_to(content_tag(:span, icon('fa-brands', 'docker'), class: "badge docker"), paper.docker_doi,target: "_blank") : ""
        if state == "accepted"
        # return safe_join([github_badge,book_badge,data_badge,docker_badge],' ')
        return safe_join([github_badge,data_badge,docker_badge],' ')
        end
      end
    
      def evidence_pretty_prpub_badge(paper)
        state = paper.state.gsub('_', ' ')
    
        prpub_badge = paper.prpub_doi ? link_to(content_tag(:span, paper.prpub_journal, class: "badge peer-review"), paper.prpub_doi,target: "_blank") : ""
        if state == "accepted"
          if paper.prpub_doi
            return safe_join([" ",prpub_badge],' ')
          else
            return ""
          end
        end
      end

end