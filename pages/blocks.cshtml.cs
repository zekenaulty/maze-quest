using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MazeQuest.pages
{
    public class BlocksModel : PageModel
    {
        private readonly IWebHostEnvironment env;

        public readonly string root;
        public readonly string blocks;
        public List<string> urls = new();

        public BlocksModel(IWebHostEnvironment hostingEnvironment)
        {
            env = hostingEnvironment;
            root = env.WebRootPath;
            blocks = $"{root}/assets/minecraft/textures/64/block";
        }

        public void OnGet()
        {
            var files = Directory.GetFiles(blocks);

            foreach(var file in files)
            {
                if(Path.GetExtension(file) == ".png")
                {
                    urls.Add($"./assets/minecraft/textures/64/block/{Path.GetFileName(file)}");
                }
            }
        }
    }
}
