document.addEventListener("DOMContentLoaded", function() {
    //libreria de animaciones
    AOS.init();

    var loading = document.getElementById('loading');
    var mensaje = document.getElementById('mensaje');

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open(method, url);

        } else {
            // Otherwise, CORS is not supported by the browser.
            xhr = null;

        }
        return xhr;
    }

    var xhr = createCORSRequest('GET', 'https://jsonplaceholder.typicode.com/posts');
    if (!xhr) {
        throw new Error('CORS not supported');
    }


    async function getPosts() 
    {
        try {
            let testimonies = [];
            let posts = [];
            const respPosts = await axios.get("https://jsonplaceholder.typicode.com/posts");

            for(let i = 0; i < 31; i = i+10 ){
                posts.push(respPosts.data[i]);
            }
            posts.map((post, index)=>{
                async function getSingleUser(id,index) 
                {
                    try {
                        // se agregan los indicadores
                        let cont = index;
                        var contStr = cont.toString();
                        var indicator = document.createElement('li'); 
                        indicator.setAttribute('data-target','#carouselExampleIndicators');
                        indicator.setAttribute('data-slide-to',index);
                        if(cont === 0){
                            indicator.classList.add("active")
                        }
                        document.getElementById('carousel-indicators').appendChild(indicator);

                        const respUser = await axios.get("https://jsonplaceholder.typicode.com/users/"+id);
                        
                        // se agrega el div
                        var div = document.createElement('div');  
                        div.innerHTML =`
                                <div class="testimonie">
                                    <img class="avatar" src="assets/images/person_${id}.jpg">
                                    <p class="comment">
                                        ${post.body}
                                    </p>
                                    <p class="author">
                                        ${respUser.data.name}
                                    </p>
                                </div> ` 
                        
                        div.classList.add("carousel-item");
                        if(cont === 0){
                            div.classList.add("active")
                        }
                        document.getElementById('carousel-inner').appendChild(div);

                        return respUser.data;
    
                    } catch(error) {
                        //si no se logran cargar los usuarios o los usuarios se elimina el carrousel
                        console.log("error", error);
                        document.getElementById("carouselExampleIndicators").remove();
                        document.getElementById('carousel-error').style.display = 'block';
                    }
                }
                let user = getSingleUser(post.userId,index)

                return user;
            });
            return posts;
        } catch(error) {
            //si no se logran cargar los post o los usuarios se elimina el carrousel
            console.log("error", error);
            document.getElementById("carouselExampleIndicators").remove();
            document.getElementById('carousel-error').style.display = 'block';
      }
    }

    getPosts();

});