# == Schema Information
#
# Table name: comments
#
#  id            :bigint           not null, primary key
#  content       :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  earthquake_id :bigint           not null
#
# Indexes
#
#  index_comments_on_earthquake_id  (earthquake_id)
#
# Foreign Keys
#
#  fk_rails_...  (earthquake_id => earthquakes.id)
#
class Comment < ApplicationRecord
    belongs_to :earthquake
    belongs_to :feature
  
    validates :body, presence: true
  end
