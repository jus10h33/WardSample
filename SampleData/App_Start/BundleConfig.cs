using System.Web;
using System.Web.Optimization;

namespace SampleData
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
                                    
            bundles.Add(new ScriptBundle("~/bundles/sample").Include(
                        "~/Scripts/sample-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/bootstrap-datepicker.min.js",
                      "~/Scripts/bootstrap-editable.min.js",
                      "~/Scripts/bootstrap3-typeahead.min.js",
                      "~/Scripts/select2.full.min.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/Scripts/angular.min.js",
                      "~/Scripts/angular-touch.min.js",
                      "~/Scripts/angular-route.min.js",
                      "~/Scripts/angular-sanitize.min.js",
                      "~/Scripts/angular-resource.min.js",
                      "~/Scripts/angular-mocks.js",
                      "~/Scripts/angular-animate.min.js",
                      "~/Scripts/autofill-event.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/font-awesome.min.css",
                      "~/Content/generics.css",
                      "~/Content/bootstrap-datepicker3.min.css",
                      "~/Content/bootstrap-editable.css",
                      "~/Content/select2.min.css",
                      "~/Content/site.css"));
        }
    }
}
