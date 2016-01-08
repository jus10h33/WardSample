using SampleData.Models;

namespace SampleData.Helpers
{
    public class SampleResult
    {
        public SampleModels Sample { get; set; }
        public bool ValidSample { get; set; }
        public bool ValidInvoice { get; set; }
        public string Message { get; set; }

        public SampleResult()
        {
            this.Sample = new SampleModels();
            this.ValidSample = true;
            this.ValidInvoice = true;
            this.Message = "";
        }
    }
}