using SampleData.Models;
using SampleData.ViewModels;

namespace SampleData.Helpers
{
    public class SampleResult
    {
        public SampleViewModel Sample { get; set; }
        public bool ValidSample { get; set; }
        public bool ValidInvoice { get; set; }
        public string Message { get; set; }

        public SampleResult()
        {
            this.Sample = new SampleViewModel();
            this.ValidSample = true;
            this.ValidInvoice = true;
            this.Message = "";
        }
    }
}