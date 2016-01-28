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
        public List<List<SampleChainModels>> SampleChains { get; set; }
        //public List<List<Recommendations>> Recommendations { get; set; }
        public List<List<int>> TopSoils { get; set; }        
    }
}