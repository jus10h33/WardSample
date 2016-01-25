using SampleData.Models;
using System.Collections.Generic;

namespace SampleData.Helpers
{
    public class SoilMasters
    {
        public List<string> RecTypes { get; set; }
        public List<string> CropTypes { get; set; }
        public List<PastCropModels> PastCrops { get; set; }
    }
}