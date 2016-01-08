using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SampleData.Models
{
    public class SoilSampleModels
    {
        [Key]
        [Required]
        [Column(Order = 1)]
        public int BatchNumber { get; set; }
        [Key]
        [Required]
        [Column(Order = 2)]
        public int LabNumber { get; set; }
        public int BeginningDepth { get; set; }
        public int EndingDepth { get; set; }
        public int PastCropNumber { get; set; }
        public int LinkedSampleBatch { get; set; }
        public int LinkedSampleLab { get; set; }
        public int TopSoil { get; set; }
    }
}