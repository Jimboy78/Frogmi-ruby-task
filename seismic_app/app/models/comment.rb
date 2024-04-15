# == Schema Information
#
# Table name: comments
#
#  id            :bigint           not null, primary key
#  body          :text
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
  validates :body, presence: true
end