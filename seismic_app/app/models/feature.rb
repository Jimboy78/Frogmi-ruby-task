# == Schema Information
#
# Table name: features
#
#  id          :bigint           not null, primary key
#  latitude    :decimal(, )
#  longitude   :decimal(, )
#  mag_type    :string
#  magnitude   :decimal(, )
#  place       :string
#  time        :datetime
#  title       :string
#  tsunami     :boolean
#  url         :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  external_id :string
#
class Feature < ApplicationRecord
    has_many :comments
end
