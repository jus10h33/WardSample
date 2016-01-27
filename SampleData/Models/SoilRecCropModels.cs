using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class SoilRecCropModels
    {
        [Key]
        [Required]
        [Column(Order = 1)]
        public int CropTypeNumber { get; set; }

        [Required]
        public string CropTypeName { get; set; }
        public string Unit { get; set; }
    }
}