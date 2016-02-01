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
                        "~/Scripts/jquery/jquery-{version}.js",
                        "~/Scripts/jquery/jquery.hotkeys.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));                                                

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap/bootstrap.min.js",
                      "~/Scripts/bootstrap/bootstrap-datepicker.min.js",
                      "~/Scripts/bootstrap/bootstrap-editable.min.js",
                      "~/Scripts/bootstrap/bootstrap3-typeahead.min.js",
                      "~/Scripts/select2.full.min.js",
                      "~/Scripts/respond.js"));            

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/Scripts/angular/angular.min.js",
                      "~/Scripts/angular/angular-touch.min.js",
                      "~/Scripts/angular/angular-route.min.js",
                      "~/Scripts/angular/angular-sanitize.min.js",
                      "~/Scripts/angular/angular-resource.min.js",
                      "~/Scripts/angular/angular-mocks.js",
                      "~/Scripts/angular/angular-animate.min.js",
                      "~/Scripts/angular/hotkeys.min.js",
                      "~/Scripts/angular/ngMask.min.js",
                      "~/Scripts/angular/autofill-event.js"));

            bundles.Add(new ScriptBundle("~/bundles/customAngular").Include(
                      "~/Scripts/mainApp.js",
                      "~/Scripts/Directives/sampleDirectives.js",
                      "~/Scripts/Filters/sampleFilters.js",
                      "~/Scripts/Services/sampleServices.js"));

            bundles.Add(new ScriptBundle("~/bundles/sample").Include(
                        "~/Scripts/sample-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/font-awesome.min.css",
                      "~/Content/generics.css",
                      "~/Content/bootstrap-datepicker3.min.css",
                      "~/Content/bootstrap-editable.css",
                      "~/Content/select2.min.css",
                      "~/Content/hotkeys.min.css",
                      "~/Content/site.css"));
        }
    }
}
