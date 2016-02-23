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
                        "~/app/components/jquery/jquery-{version}.js"
                        //,"~/app/components/jquery/jquery.hotkeys.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/app/components/jquery/jquery.validate*"
            ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/general").Include(
                        "~/Scripts/modernizr-*"
                        ,"~/Scripts/underscore.js"
                        ,"~/Scripts/respond.js"
            ));                                              

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/app/components/bootstrap/bootstrap.min.js"
                      ,"~/app/components/bootstrap/bootstrap-datepicker.min.js"
                      ,"~/app/components/select2.full.min.js"
            ));


            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/app/components/angular/angular.min.js"
                      //,"~/app/components/angular/angular-touch.min.js"
                      //,"~/app/components/angular/angular-route.min.js"
                      ,"~/app/components/angular/angular-ui-router.min.js"
                      //,"~/app/components/angular/angular-sanitize.min.js"
                      //,"~/app/components/angular/angular-resource.min.js"
                      //,"~/app/components/angular/angular-mocks.js"
                      //,"~/app/components/angular/angular-animate.min.js"
                      ,"~/app/components/angular/hotkeys.min.js"
                      //,"~/app/components/angular/ngMask.min.js"
                      //,"~/app/components/angular/autofill-event.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/sample").Include(
                        "~/app/app.js"
                        ,"~/app/modules/Directives/SampleDirectives.js"
                        ,"~/app/modules/sample/sample.js"
                        ,"~/app/modules/sample/entry/entry.js"
                        ,"~/app/modules/sample/entry/services/SampleServices.js"
            ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/app/assets/css/bootstrap.min.css"
                      ,"~/app/assets/css/font-awesome.min.css"
                      ,"~/app/assets/css/generics.css"
                      ,"~/app/assets/css/bootstrap-datepicker3.min.css"
                      ,"~/app/assets/css/select2.min.css"
                      ,"~/app/assets/css/hotkeys.min.css"
                      ,"~/app/assets/css/site.css"
            ));
        }
    }
}
