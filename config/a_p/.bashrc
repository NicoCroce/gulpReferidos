# updated version here: https://gist.github.com/garystafford/8197021
up=$(cygpath $USERPROFILE)
export PATH=$up/AppData/Roaming/npm:$PATH

function proxy_on(){
   export PASSWORD=junio2015 PROXY_SERVER=200.5.92.164 PROXY_PORT=8080
   export HTTP_PROXY="http://xa50310:$PASSWORD@$PROXY_SERVER:$PROXY_PORT"
   export HTTPS_PROXY="$HTTP_PROXY" FTP_PROXY="$HTTP_PROXY" ALL_PROXY="$HTTP_PROXY" \
      NO_PROXY="localhost,127.0.0.1" GIT_CURL_VERBOSE=1 GIT_SSL_NO_VERIFY=1
   echo -e "\nProxy-related environment variables set.!"
}

function proxy_off(){
   variables=( "PASSWORD" "PROXY_SERVER" "PROXY_PORT" "HTTP_PROXY" "HTTPS_PROXY" \
      "FTP_PROXY" "ALL_PROXY" "NO_PROXY" "GIT_CURL_VERBOSE" "GIT_SSL_NO_VERIFY" )
   for i in "${variables[@]}"; do unset $i; done
   echo -e "\nProxy-related environment variables removed."
}

proxy_on
