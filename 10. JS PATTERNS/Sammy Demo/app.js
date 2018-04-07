$(() => {
   const app = Sammy('#main', function () {
       this.use('Handlebars', 'hbs');

       this.get('#/index.html', (context) => {
          context.swap('<h1>Hello from Sammy.js</h1>');
       });

       this.get('#/about', function () {
          this.swap('<h1>About Page</h1>');
       });

       this.get('#/contact', function () {
          this.swap('<h1>Contact page</h1>');
       });

       this.get('#/book/:bookId', (ctx) => {
          let bookId = ctx.params.bookId;
          ctx.swap(`<h1>${bookId}</h1>`);
       });

       this.get('#/path', (ctx) => {
           let path = ctx.path;
           ctx.swap(`<h1>${path}</h1>`);
       });

       this.get('#/login', (ctx) => {
           ctx.swap(`
                <form action="#/login" method="post">
                    User: <input name="user" type="text">
                    Pass: <input name="pass" type="password">
                    <input type="submit" value="Login">
                </form>`)
       });

       this.post('#/login', (ctx) => {
           let username = ctx.params.user;
           let password = ctx.params.pass;

           ctx.redirect('#/contact');
       });

       this.get('#/hello/:name', (ctx) => {
           ctx.title = 'Hello';
           ctx.name = ctx.params.name;
           ctx.loadPartials({
              header: 'templates/common/header.hbs',
              footer: 'templates/common/footer.hbs'
           }).then(function () {
               this.partial('templates/greetings.hbs');
           });
           ctx.partial('templates/greetings.hbs');
       });
   });

   app.run();
});