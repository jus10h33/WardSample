using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.ViewModels
{
    public class SoilRecViewModel
    {
        public int BatchNumber { get; set; }
        public int LabNumber { get; set; }
        public int Priority { get; set; }
        public int RecTypeNumber { get; set; }
        public int CropTypeNumber { get; set; }
        public double YieldGoal { get; set; }
        public string RecTypeDisplay { get; set; }
        public string CropTypeDisplay { get; set; }
        public override string ToString()
        {
            return "BatchNumber: " + BatchNumber +
                "\nLabNumber: " + LabNumber +
                "\nPriority: " + Priority +
                "\nRecTypeNumber: " + RecTypeNumber +
                "\nCropTypeNumber: " + CropTypeNumber +
                "\nYieldGoal: " + YieldGoal +
                "\nRecTypeDisplay: " + RecTypeDisplay +
                "\nCropTypeDisplay: " + CropTypeDisplay;
        }
    }
}