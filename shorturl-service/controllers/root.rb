get '/api/encode' do
  originUrl = params[:originUrl]
  shortUrl = ShortUrlRecord.encode(originUrl)
  # check redundency
  return "#{request.scheme}://#{request.host}/#{shortUrl}"
end

get '/api/decode' do
  shortUrl = params[:shortUrl]
  return ShortUrlRecord.decode(shortUrl)
end

get '/' do
  erb :index
end

get '/:encoded_uri' do
  shortUrl = params[:encoded_uri]
  @originUrl = ShortUrlRecord.decode(shortUrl)
  if @originUrl
    erb :shorturl
  else
    erb :not_found, :layout => false
  end
end