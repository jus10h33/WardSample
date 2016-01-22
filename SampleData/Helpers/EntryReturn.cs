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
        public SampleInfoReturn SampleInfoReturn { get; set; }
        public List<SampleTypeModels> SampleTypes { get; set; }
        public List<SampleColumns> SampleColumns { get; set; }
        public List<List<SoilSampleModels>> SoilSamplesList { get; set; }
        public List<int> TopSoils { get; set; }
        public List<string> RecTypes { get; set; }
        public List<string> CropTypes { get; set; }
        public List<PastCropModels> PastCrops { get; set; }         
        public List<SubSampleTypeModels> SubSampleTypes { get; set; }
        public List<string> Messages { get; set; }
    }
}