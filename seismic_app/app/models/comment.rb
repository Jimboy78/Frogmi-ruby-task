# == Schema Information
#
# Table name: comments
#
#  id         :bigint           not null, primary key
#  content    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  feature_id :bigint           not null
#
# Indexes
#
#  index_comments_on_feature_id  (feature_id)
#
# Foreign Keys
#
#  fk_rails_...  (feature_id => features.id)
#
class Comment < ApplicationRecord
    belongs_to :earthquake
    belongs_to :feature
  
    validates :body, presence: true
  end
