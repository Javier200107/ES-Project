# ES-Project
***

### Execució FRONTEND:



### Execució BACKEND:


## Requests Backend

> **Nota:** La tabla està en format HTML, motiu pel qual per escriure codi dins faig servir
> el tag `<pre>`. 
> A la columna de `body`, si podeu subratllar els paràmetres que no siguin necessaris per fer la request.

### Registre

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
        <td>GET</td>
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
        <td>POST</td>
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

### Login
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

### Posts
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
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/posts</code></pre></th>
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
        <th rowspan="5" scope="colgroup"><pre><code>http://127.0.0.1:5000/uposts</code></pre></th>
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

### Likes
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

### Follow
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
