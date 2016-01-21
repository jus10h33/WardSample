using SampleData.Models;
using SampleData.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.Helpers
{
    public class EntryReturn
    {        
        public SampleViewModel Sample { get; set; }
        public CustomerViewModel Customer { get; set; }
        public List<SampleTypeModels> SampleTypes { get; set; }       
        public List<SampleColumns> SampleColumns { get; set;}
        public List<Recommendations> Recommendations { get; set; }
        public SoilSampleModels SoilSample { get; set; }
        public SubSampleTypeModels SubSampleType { get; set; }
        public SubSubSampleTypeModels SubSubSampleType { get; set; }
        public SubSampleInfoModels SubSampleInfo { get; set; }
        public List<SoilSampleModels> SoilSamples { get; set; }
        public List<string> RecTypes { get; set; }
        public List<string> CropTypes { get; set; }
        public List<PastCropModels> PastCrops { get; set; } 
        public List<int> TopSoils { get; set; }   
        public List<SubSampleTypeModels> SubSampleTypes { get; set; }
        public List<SubSubSampleTypeModels> SubSubSampleTypes { get; set; }    
        public List<string> Messages { get; set; }
    }
}