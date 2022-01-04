const API_URL = "https://jsonplaceholder.typicode.com";
const postsContainer = document.querySelector("#posts");
const loader = '<object id="loader" type="image/svg+xml" data="loader.svg" width="30" height="30" >'; 

//добавляем обработчик пост контейнера
postsContainer.addEventListener('click',commentsBtnHandler);

// получаем 20 постов
(async () => {
    
    postsContainer.innerHTML = loader;
  
    for (let i = 1; i <= 20; i++) {
        
        fetch(`${API_URL}/posts/${i}`)
        .then((response) => response.json())
        .then((json) => {

        // если отображается лодер, то удалим его
        if (document.getElementById('loader')) {
            document.getElementById('loader').remove();
        }

        // полученные посты отрисовываем на странице
        const figure = document.createElement("figure");       

        postsContainer.append(figure);   

        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = `<h3> ${json.title} </h3>`;
        figure.append(figcaption);          

        const post = document.createElement("p");
        post.classList.add("post");
        post.innerHTML = `<span>Post:</span> ${json.body}`;
        figure.append(post);

        const btn = document.createElement("button");
        btn.innerHTML = 'Show comments';
        btn.className = 'comments-btn';
        btn.name = `comments ${i}`; // сохраняем номер поста для дальнейшего получения комментариев к нему
        figure.append(btn); 

        
        });    
    }  
})();

// обработчик для кнопки комментариев
function commentsBtnHandler(e) {      

  if (e.target && e.target.classList.contains('comments-btn')) {
    
    const parent = e.target.parentNode;
    // если кнопка имеет класс 'active', т.е. комментарии оторажены, то удаляем блок комментариев, 
    // а у самой кнопки удалем класс 'active' и содержимое кнопки
    if (e.target.classList.contains('active')) {

      parent.querySelector('.comments').remove();
      e.target.classList.remove('active');
      e.target.textContent = 'Show comments';

    } else {
        // иначе грузим комменты 
        
        // если по каким-то причинам блок комментов уже есть - удаляем предварительно
        if (parent.querySelector('.comments')) {
            parent.querySelector('.comments').remove();
        }

        // создаем блок для комментов     
        const commentsElem = document.createElement("div");
        commentsElem.className = 'comments';        
        parent.append(commentsElem);

        commentsElem.innerHTML = loader; // первоначально отобразим лодер

        // из свойства name кнопки получаем ид комментария, который был туда сохранен
        const postId = e.target.name.split(' ')[1];

        fetch(`${API_URL}/comments?postId=${postId}`)
            .then((response) =>  response.json())
            .then((json) => {
                // модифицирем кнопку комментариев, чтобы иметь возможность спрятать их
                e.target.classList.add('active');
                e.target.innerHTML = 'Hide comments';
                // очищаем блок от лодера
                commentsElem.innerHTML = '';

                // и выводим комменты в абзацах
                json.forEach(element => {

                    let comment = document.createElement('p');
                    comment.className = 'comment';
                    comment.innerHTML = `<span><em>${element.email}</em></span><br>
                                        ${element.body}`;
                    commentsElem.append(comment); 

                });
                                
            })
            .catch(err => {
                console.error('Error: ' + err);
                const alertMsg = '<p class="alert">Something went wrong. Please try later</p>';
                if (parent.querySelector('.alert')) return;
                else {
                    commentsElem.innerHTML = alertMsg;
                }            
            }); 
    }   
  }
}