class AddPrpubToPapers < ActiveRecord::Migration[6.0]
  def change
    add_column :papers, :prpub_doi, :string
    add_column :papers, :prpub_journal, :string
  end
end
