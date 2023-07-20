var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

var app = builder.Build();

app.UseFileServer();
app.UseStaticFiles();
app.UseDefaultFiles();
app.UseHttpsRedirection();

app.UseRouting();

app.MapRazorPages();

app.Run();
