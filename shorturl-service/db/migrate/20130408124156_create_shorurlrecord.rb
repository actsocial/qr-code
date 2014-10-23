class CreateShorurlrecord < ActiveRecord::Migration
  def self.up
    create_table :short_url_records do |t|
      t.string :origin_url
      t.string :short_url
      t.integer :pv

      t.timestamps
    end
  end

  def self.down
    drop_table :short_url_records
  end
end
