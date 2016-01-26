using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SampleData.Models
{
    public class SoilRecModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int BatchNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int LabNumber { get; set; }
        public int Priority { get; set; }
        [Key]
        [Column(Order = 3)]
        [Required]
        public int RecTypeNumber { get; set; }
        [Key]
        [Column(Order = 4)]
        [Required]
        public int CropTypeNumber { get; set; }
        [Key]
        [Column(Order = 5)]
        [Required]
        public double YieldGoal { get; set; }
        public override string ToString()
        {
            return "BatchNumber: " + BatchNumber +
                "\nLabNumber: " + LabNumber +
                "\nPriority: " + Priority +
                "\nRecTypeNumber: " + RecTypeNumber +
                "\nCropTypeNumber: " + CropTypeNumber +
                "\nYieldGoal: " + YieldGoal;


        }
    }
}