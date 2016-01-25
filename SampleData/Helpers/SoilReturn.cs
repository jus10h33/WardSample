using SampleData.Models;
using SampleData.ViewModels;
using System.Collections.Generic;

namespace SampleData.Helpers
{
    public class SoilReturn
    {
        // Generic Info
        public GenericInfo GenericInfo { get; set; }

        // Masters
        public GenericMasters GenericMasters { get; set; }        

        // Soil Masters
        public SoilMasters SoilMasters { get; set; }

        // Soil Specific
        public List<SampleChainModels> SampleChains { get; set; }
        public List<Recommendations> Recommendations { get; set; }
        public List<List<SampleChainModels>> SampleChainsList { get; set; }
        public List<int> TopSoils { get; set; }        
    }
}