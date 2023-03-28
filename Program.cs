var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseFileServer();
app.UseStaticFiles();
app.UseDefaultFiles();
app.UseHttpsRedirection();

app.Run();
