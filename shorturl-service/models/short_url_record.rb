class ShortUrlRecord < ActiveRecord::Base
  
  def self.encode(originUrl)
    sur = self.find_by_origin_url originUrl
    if sur.nil?
      id = self.generateId
      short_url = ShortUrlGenerator.encode(id)

      sur = self.new
      sur.origin_url = originUrl
      sur.short_url = short_url
      sur.save
    else
      short_url = sur.short_url
    end
    return short_url
  end

  def self.decode(shortUrl)
    # id = ShortUrlGenerator.decode(shortUrl.split("/").last)
    origin_url = nil
    begin
      sur = self.find_by_short_url(shortUrl.split("/").last)
      origin_url =  sur.origin_url
    rescue Exception => e
      e
    end
    origin_url
  end

  def self.generateId
    prng = Random.new
    prng.rand(1e6.to_i)
  end
end