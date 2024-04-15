# == Schema Information
#
# Table name: earthquakes
#
#  id          :bigint           not null, primary key
#  depth       :float
#  latitude    :float
#  longitude   :float
#  magType     :string
#  magnitude   :float
#  place       :string
#  time        :bigint
#  title       :string
#  tsunami     :integer
#  url         :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  external_id :string
#
# Indexes
#
#  index_earthquakes_on_external_id  (external_id) UNIQUE
#

class Earthquake < ApplicationRecord
    validates :external_id, presence: true, uniqueness: true
    validates :title, :url, :place, :magType, presence: true
    validates :magnitude, inclusion: -1.0..10.0
    validates :latitude, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
    validates :longitude, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
  
    before_save :check_coordinates_presence

    has_many :comments, dependent: :destroy
    
    private
  
    def check_coordinates_presence
      throw(:abort) if longitude.nil? || latitude.nil?
    end
  end
  