using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class ReportModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int ReportTypeNumber { get; set; }
        public string ReportName { get; set; }
        public double StandardCost { get; set; }
        public double PrimaryVolumeCost { get; set; }
        public double SecondaryVolumeCost { get; set; }
        public int FileReferenceNumber { get; set; }
        public int SplitOverride { get; set; }
        public string Description { get; set; }
    }
}