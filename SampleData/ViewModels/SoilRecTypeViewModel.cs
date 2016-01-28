
namespace SampleData.ViewModels
{
    public class SoilRecTypeViewModel
    {
        public int RecTypeNumber { get; set; }
        public string RecTypeName { get; set; }
        public string RecTypeDisplay { get; set; }

        public SoilRecTypeViewModel()
        {
            this.RecTypeNumber = 0;
            this.RecTypeName = "";
            this.RecTypeDisplay = this.RecTypeNumber + " - " + this.RecTypeName;
        }
    }
}