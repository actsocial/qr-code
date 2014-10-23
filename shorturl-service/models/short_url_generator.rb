class ShortUrlGenerator
  ENCODER = Hash.new do |h,k|
    h[k] = Hash[ k.chars.map.with_index.to_a.map(&:reverse) ]
  end
  DECODER = Hash.new do |h,k|
    h[k] = Hash[ k.chars.map.with_index.to_a ]
  end
  @@base62 = [ *0..9, *'a'..'z', *'A'..'Z' ].join

  def self.encode(value)
    ring = ENCODER[@@base62]
    base = @@base62.length
    result = []
    until value == 0
      result << ring[ value % base ]
      value /= base
    end
    result.reverse.join
  end

  def self.decode(string)
    ring = DECODER[@@base62]
    base = @@base62.length
    string.reverse.chars.with_index.inject(0) do |sum,(char,i)|
      sum + ring[char] * base**i
    end
  end
end