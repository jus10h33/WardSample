using SampleData.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.Helpers
{
    public class EntryReturn
    {        
        public int SampleTypeNumber { get; set; }
        public int BatchNumber { get; set; }
        public int LabNumber { get; set; }
        public int CustomerNumber { get; set; }
        public int InvoiceNumber { get; set; }
        public DateTime DateReceived { get; set; }
        public DateTime DateReported { get; set; }
        public int ReportTypeNumber { get; set; }
        public string ReportName { get; set; }
        public double ReportCost { get; set; }
        public string Grower { get; set; }
        public string SampleID1 { get; set; }
        public string SampleID2 { get; set; }
        public string SampleID3 { get; set; }
        public string SampleID4 { get; set; }
        public string SampleID5 { get; set; }
        public int StandardCost { get; set; }
        public string Name { get; set; }
        public string Company { get; set; }
        public string Address1 { get; set; }
        public string CityStZip { get; set; }       
        public string SampleEntryInformation { get; set; }
        public int BeginningDepth { get; set; }
        public int EndingDepth { get; set; }
        public int PastCropNumber { get; set; }
        public int LinkedSampleBatch { get; set; }
        public int LinkedSampleLab { get; set; }
        public int TopSoil { get; set; }
        public string PastCropName { get; set; }
        public List<SampleTypeModels> SampleTypes { get; set; }
        public List<string> Growers { get; set; }        
        public List<SampleColumns> SampleColumns { get; set;}
        public List<Recommendations> Recommendations { get; set; }
        public List<SoilSampleModels> SoilSamples { get; set; }
        public List<SoilRecTypeModels> SoilRecTypes { get; set; }
        public List<SoilRecCropModels> SoilRecCrops { get; set; }
        public List<string> RecTypes { get; set; }
        public List<string> CropTypes { get; set; }
        public List<PastCropModels> PastCrops { get; set; }        
        public List<string> Messages { get; set; }
        //public ReportItemModels ReportItem { get; set; }
    }
}