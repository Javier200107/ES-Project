# ES-Project
***

[![Build and Deploy to Azure](https://github.com/UB-ES-2022-F3/ES-Project/actions/workflows/build_and_deploy.yml/badge.svg)](https://github.com/UB-ES-2022-F3/ES-Project/actions/workflows/build_and_deploy.yml)

### Execució FRONTEND:

Execució BACKEND:
============

### _Creació base de dades_:

A la terminal de Pycharm o al cmd executem:
```python
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```
> *Nota:* Si hi ha canvis a backend, cal eliminar la carpeta `migration` i `instance` on es crea la ddb, per poder utilitzar els nous canvis.

### _Executem backend_:
```python
flask run
```

Requests Backend
============

> **Nota:** La tabla està en format HTML, motiu pel qual per escriure codi dins faig servir
> el tag `<pre>`. 
> A la columna de `body`, si podeu subratllar els paràmetres que no siguin necessaris per fer la request.

### [Registre](/backend/resources/accounts.py)

<table>
    <tr>
        <th colspan="6" scope="rowgroup">Registre</th>
    </tr>
    <tr>
        <th>URL</th>
        <td>Request</td>
        <td>Body</td>
        <td>Descripció</td>
        <td>Possibles errors</td>
        <td>Retorna</td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/account</code></pre></th>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
        <td>POST</td>
        <td><pre>
{ 
  "username": "Buenas",
  "password": "Lolita1234"
  "email": "hol@gails.com"
  "nom": "Pepito",
  "cognom": "Pérez",
  "birthdate": "2001-06-25",
  <u>"is_admin"</u>: "0",
}</pre></td>
        <td>Crear compte</td>
        <td>
            · Username exist<br/>
            · Email exist<br/> 
            · Contraseña error
        </td>
        <td><pre>
{ 
  "account": { 
     "id": 1,
     "username": "Buenas",
     "password": "Lolita1234"
     "email": "hol@gails.com"
     "nom": "Pepito",
     "cognom": "Pérez",
     "birthdate": "2001-06-25",
     "is_admin": "0",
  }
}</pre></td>
<tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

### [Login](/backend/resources/login.py)
<table>
    <tr>
        <th colspan="6" scope="rowgroup">Login</th>
    </tr>
    <tr>
        <th>URL</th>
        <td>Request</td>
        <td>Body</td>
        <td>Descripció</td>
        <td>Posibles errors</td>
        <td>Retorna</td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/account</code></pre></th>
        <td>GET</td>
        <td><pre>
{ 
  "username": "Buenas",
  "password": "Lolita1234"
}</pre></td>
        <td>Crear compte</td>
        <td>
            · Username error<br/>
            · Contrassenya error
        </td>
        <td><pre>
{ 
  "token": String
}</pre></td>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

## post.json 

"id": self.id,<br/>
"text": text del post,<br/>
"time": hora de publicació,<br/>
"archived": archivat(1) o no archivat(0),<br/>
"account_id": id del compte que ha publicat el post ,<br/>
"account_name": nom del compte que ha publicat el post,<br/>
"parent_id": id del post comentat (en cas de ser un comentari),<br/>
"accounts_like": json de comptes que han donat like,<br/>
"num_likes": numero de likes del post ,<br/>
"community": post realitzat a community (1) o no (0)
            

### [Posts](/backend/resources/posts.py)
<table>
    <tr>
        <th colspan="6" scope="rowgroup">Posts</th>
    </tr>
    <tr>
        <th>URL</th>
        <td>Request</td>
        <td>Body</td>
        <td>Descripció</td>
        <td>Posibles errors</td>
        <td>Retorna</td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/posts, posts/*int:id*</code></pre></th>
    <tr>
        <td>GET</td>
        <td>{ 
  "limit": 10,
  "offset": 0
        }</td>
        <td>Retorna els posts per la main page, tots els posts excepte els archivats i els posts de community</td>
        <td>No posts</td>
        <td>return {"posts": [post.json() for post in posts]}, 200  </td>
    </tr>
        <td>POST</td>
        <td>{ 
  "text": "text del post",
  "parent_id": 1
        }</td>
        <td>Permet afegir un post, si es coloca un int a la URL (/posts/1 per exemple), es marcarà community com a 1, si no community =0 </td>
        <td>error al crear post</td>
        <td>return {"post": new_post.json()}, 201
</td>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>


<table>
<tr>
        <th colspan="6" scope="rowgroup">uPosts</th>
    </tr>
    <tr>
        <th>URL</th>
        <td>Request</td>
        <td>Body</td>
        <td>Descripció</td>
        <td>Posibles errors</td>
        <td>Retorna</td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/uposts, /uposts/*string:user*</code></pre></th>
    <tr>
        <td>GET</td>
        <td>{ 
  "limit": 10,
  "offset": 0,
  "archived":0
        }</td>
        <td> -Retorna els posts de l'usuari (archivats o no segons el valor d'archived)<br/>         
            -Són els posts de l'usuari amb el nom concret de l'string, si no és passa string, retorna els del usuari loguejat.<br/>             
            -En cas de retornar els posts d'un usuari diferent del loguejat no retorna els posts de community<br/>
        </td>
        <td>
            · No userr<br/>
            · Archived posts can only be seen by the owner<br/>
            · No posts                     
        </td>
        <td>return {"posts": [post.json() for post in posts]}, 200  </td>
    </tr>
        
</table>

### [Likes](/backend/resources/like.py)
<table>
    <tr>
        <th colspan="6" scope="rowgroup">Like</th>
    </tr>
    <tr>
        <th>URL</th>
        <td>Request</td>
        <td>Body</td>
        <td>Descripció</td>
        <td>Posibles errors</td>
        <td>Retorna</td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/likes</code></pre></th>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
        <td>POST</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
<tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/likePlist/</code></pre></th>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
        <td>POST</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
<tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/likeUlist/</code></pre></th>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
        <td>POST</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

### [Follow](/backend/resources/follow.py)
<table>
    <tr>
        <th colspan="6" scope="rowgroup">Posts</th>
    </tr>
    <tr>
        <th>URL</th>
        <td>Request</td>
        <td>Body</td>
        <td>Descripció</td>
        <td>Possibles errors</td>
        <td>Retorna</td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/follow/</code></pre></th>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
        <td>POST</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/followList/</code></pre></th>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
        <td>POST</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/followingList/</code></pre></th>
    <tr>
        <td>GET</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
        <td>POST</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    <tr>
        <td>PUT</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

***
Pequeños ejemplos con codigo Markdown:
-
> **Nota:** Esto es codigo random que he cogido por internet con 
> cosas que pueden ser útiles sin tener que ir a buscarlo así no perdeis tanto tiempo :)
<!--sec data-title="Prompt: OS X and Linux" data-id="OSX_Linux_prompt" data-collapse=true ces-->

Si estás en Mac o Linux, probablemente veas una `$`, como ésta:

    $
<!--endsec-->

> **Nota:** Aqui deberiamos explicar que `vamos` a hacer

Esto que  `pasa podemos` explicar de esta manera

***

Para poner un enlace [nombreEnlace]()

```json 
{"username" : "Estela", "esd": "sdsd"}
```
[`dist`](/backend) (Tengo que probarlo)

```sh
# Using npm
npm install --save json2md
const myJSON = { "name": "Chris", "age": "38" };

# Using yarn
yarn add json2md
```
