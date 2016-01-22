using SampleData.Models;
using SampleData.ViewModels;
using System.Collections.Generic;

namespace SampleData.Helpers
{
    public class SampleInfoReturn
    {
        public List<SampleViewModel> Samples { get; set; }
        public List<CustomerViewModel> Customers { get; set; }
        public List<SoilSampleModels> SoilSamples { get; set; }
        public List<Recommendations> Recommendations { get; set; }
        public List<SubSampleInfoModels> SubSampleInfos { get; set; }
    }
}