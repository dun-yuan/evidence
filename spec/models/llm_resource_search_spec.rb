require 'rails_helper'

RSpec.describe LlmResourceSearch, type: :model do
  describe "#call" do
    it "finds dataset resources from archive doi and body links" do
      paper = build(
        :accepted_paper,
        title: "Climate workflows",
        archive_doi: "10.5281/zenodo.12345",
        body: "Supplementary dataset: https://figshare.com/articles/dataset/example/9999"
      )

      results = described_class.new(
        scope: [paper],
        query: "climate dataset zenodo",
        kind: "dataset",
        limit: 10
      ).call

      expect(results).not_to be_empty
      expect(results.map(&:resource_type).uniq).to eq(["dataset"])
      expect(results.map(&:resource_url).join(" ")).to match(/zenodo|figshare/)
    end

    it "finds code resources from repository urls" do
      paper = build(
        :accepted_paper,
        title: "Ocean simulation toolkit",
        repository_url: "https://github.com/openjournals/joss-reviews"
      )

      results = described_class.new(
        scope: [paper],
        query: "ocean github code",
        kind: "code",
        limit: 10
      ).call

      expect(results).not_to be_empty
      expect(results.first.resource_type).to eq("code")
      expect(results.first.resource_url).to include("github.com")
    end
  end
end
