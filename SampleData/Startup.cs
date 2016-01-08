using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SampleData.Startup))]
namespace SampleData
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
