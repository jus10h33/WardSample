using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class SubSampleInfoModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int BatchNumber { get; set; }
        [Key]
        [Column(Order = 3)]
        [Required]
        public int LabNumber { get; set; }
        [Required]
        public int SubSampleTypeNumber { get; set; }
        public int SubSubSampleTypeNumber { get; set; }
    }
}