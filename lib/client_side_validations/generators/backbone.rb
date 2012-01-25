module ClientSideValidations
  module Generators
    class Backbone
      def self.assets
        [{
          :path => File.expand_path('../../../../vendor/assets/javascripts', __FILE__),
          :file => 'rails.validations.backbone.js'
        }]
      end

      Generators.register_assets(self)
    end
  end
end



