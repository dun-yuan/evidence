require 'net/http'
require 'json'
class TemplatesController < ApplicationController
  def index
    @templates = load_templates
    # Rails.logger.debug("Loaded templates: #{@templates.inspect}")
  end
  
  def show
    template_id = params[:id]
    if template_id.present?
      # Redirect to new paper with template parameter
      redirect_to new_paper_path(template: template_id)
    else
      flash[:alert] = "Template ID is required"
      redirect_to templates_path
    end
  end
  
  private
  
  def load_templates
    yaml_file = Rails.root.join('lib', 'evidence_templates.yml')
    # Rails.logger.debug("Looking for YAML file at: #{yaml_file}")
    
    if File.exist?(yaml_file)
      begin
        templates = YAML.load_file(yaml_file)
        if templates.is_a?(Hash) && templates['templates'].is_a?(Array)
          return templates['templates']
        else
          Rails.logger.error("Invalid YAML structure in #{yaml_file}. Expected {'templates': [...]}")
          return []
        end
      rescue => e
        Rails.logger.error("Error loading YAML file: #{e.message}")
        return []
      end
    else
      Rails.logger.warn("Templates YAML file not found at #{yaml_file}")
      [] # Return empty array if file doesn't exist
    end
  end
end 