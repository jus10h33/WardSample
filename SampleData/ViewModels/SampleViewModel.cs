using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.ViewModels
{
    public class SampleViewModel
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
        public int CostTypeNumber { get; set; }
        public string PastCropName { get; set; }
    }
}