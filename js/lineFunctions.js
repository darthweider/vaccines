lineFunctions = d3.map (
{"US National":"M90.70796460176992,443L159.73451327433628,443L228.76106194690266,469.1L297.78761061946904,449.30000000000007L366.8141592920354,449.30000000000007L435.8407079646018,451.1L504.86725663716817,470L573.8938053097346,456.5L642.920353982301,455.6L711.9469026548674,462.8L780.9734513274337,452.9","Alabama":"M90.70796460176992,459.2L159.73451327433628,453.8L228.76106194690266,417.80000000000007L297.78761061946904,434L366.8141592920354,425L435.8407079646018,437.6L504.86725663716817,421.4L573.8938053097346,421.4L642.920353982301,434L711.9469026548674,442.1L780.9734513274337,472.7","Alaska":"M90.70796460176992,463.7L159.73451327433628,472.7L228.76106194690266,434.9L297.78761061946904,508.7L366.8141592920354,472.7L435.8407079646018,484.4L504.86725663716817,513.1999999999999L573.8938053097346,484.4L642.920353982301,462.8L711.9469026548674,504.2L780.9734513274337,465.5","Arizona":"M90.70796460176992,456.5L159.73451327433628,443.9L228.76106194690266,431.3L297.78761061946904,490.69999999999993L366.8141592920354,479L435.8407079646018,450.2L504.86725663716817,462.8L573.8938053097346,490.69999999999993L642.920353982301,499.7L711.9469026548674,485.30000000000007L780.9734513274337,457.4","Arkansas":"M90.70796460176992,464.6L159.73451327433628,428.6L228.76106194690266,430.4L297.78761061946904,494.30000000000007L366.8141592920354,447.5L435.8407079646018,450.2L504.86725663716817,543.8000000000001L573.8938053097346,465.5L642.920353982301,436.7L711.9469026548674,449.30000000000007L780.9734513274337,485.30000000000007","California":"M90.70796460176992,444.8L159.73451327433628,442.1L228.76106194690266,451.1L297.78761061946904,483.5L366.8141592920354,428.6L435.8407079646018,445.69999999999993L504.86725663716817,471.80000000000007L573.8938053097346,457.4L642.920353982301,461L711.9469026548674,456.5L780.9734513274337,463.7","Colorado":"M90.70796460176992,509.6L159.73451327433628,462.8L228.76106194690266,441.2L297.78761061946904,476.3L366.8141592920354,459.2L435.8407079646018,449.30000000000007L504.86725663716817,527.6L573.8938053097346,476.3L642.920353982301,484.4L711.9469026548674,456.5L780.9734513274337,506","Connecticut":"M90.70796460176992,394.3999999999999L159.73451327433628,425L228.76106194690266,437.6L297.78761061946904,457.4L366.8141592920354,422.30000000000007L435.8407079646018,422.30000000000007L504.86725663716817,436.7L573.8938053097346,399.80000000000007L642.920353982301,425L711.9469026548674,426.8L780.9734513274337,457.4","Delaware":"M90.70796460176992,443L159.73451327433628,429.5L228.76106194690266,492.5L297.78761061946904,428.6L366.8141592920354,426.8L435.8407079646018,442.1L504.86725663716817,468.19999999999993L573.8938053097346,434L642.920353982301,464.6L711.9469026548674,430.4L780.9734513274337,426.8","Dist. of Columbia":"M573.8938053097346,427.69999999999993L642.920353982301,438.5L711.9469026548674,443L780.9734513274337,414.2","Florida":"M90.70796460176992,423.2L159.73451327433628,421.4L228.76106194690266,503.3L297.78761061946904,485.30000000000007L366.8141592920354,449.30000000000007L435.8407079646018,454.69999999999993L504.86725663716817,459.2L573.8938053097346,433.1000000000001L642.920353982301,462.8L711.9469026548674,461L780.9734513274337,439.4","Georgia":"M90.70796460176992,463.7L159.73451327433628,452.9L228.76106194690266,434L297.78761061946904,450.2L366.8141592920354,457.4L435.8407079646018,445.69999999999993L504.86725663716817,458.3L573.8938053097346,456.5L642.920353982301,433.1000000000001L711.9469026548674,452.9L780.9734513274337,434.9","Hawaii":"M90.70796460176992,437.6L159.73451327433628,427.69999999999993L228.76106194690266,490.69999999999993L297.78761061946904,459.2L366.8141592920354,435.8L435.8407079646018,426.8L504.86725663716817,499.7L573.8938053097346,441.2L642.920353982301,432.19999999999993L711.9469026548674,425L780.9734513274337,444.8","Idaho":"M90.70796460176992,443.9L159.73451327433628,454.69999999999993L228.76106194690266,501.5L297.78761061946904,462.8L366.8141592920354,505.1L435.8407079646018,505.1L504.86725663716817,487.1L573.8938053097346,495.2L642.920353982301,474.5L711.9469026548674,440.30000000000007L780.9734513274337,460.1","Illinois":"M90.70796460176992,437.6L159.73451327433628,425L228.76106194690266,443L297.78761061946904,431.3L366.8141592920354,442.1L435.8407079646018,461L504.86725663716817,486.2L573.8938053097346,465.5L642.920353982301,462.8L711.9469026548674,455.6L780.9734513274337,457.4","Indiana":"M90.70796460176992,447.5L159.73451327433628,456.5L228.76106194690266,459.2L297.78761061946904,437.6L366.8141592920354,466.3999999999999L435.8407079646018,488L504.86725663716817,500.6000000000001L573.8938053097346,449.30000000000007L642.920353982301,464.6L711.9469026548674,470L780.9734513274337,452","Iowa":"M90.70796460176992,460.1L159.73451327433628,443.9L228.76106194690266,454.69999999999993L297.78761061946904,488L366.8141592920354,443L435.8407079646018,457.4L504.86725663716817,441.2L573.8938053097346,435.8L642.920353982301,499.7L711.9469026548674,440.30000000000007L780.9734513274337,429.5","Kansas":"M90.70796460176992,475.4L159.73451327433628,449.30000000000007L228.76106194690266,445.69999999999993L297.78761061946904,477.19999999999993L366.8141592920354,442.1L435.8407079646018,452.9L504.86725663716817,447.5L573.8938053097346,470L642.920353982301,461L711.9469026548674,483.5L780.9734513274337,475.4","Kentucky":"M90.70796460176992,420.5L159.73451327433628,461L228.76106194690266,468.19999999999993L297.78761061946904,483.5L366.8141592920354,462.8L435.8407079646018,468.19999999999993L504.86725663716817,479.9L573.8938053097346,474.5L642.920353982301,457.4L711.9469026548674,477.19999999999993L780.9734513274337,474.5","Louisiana":"M90.70796460176992,484.4L159.73451327433628,481.7L228.76106194690266,477.19999999999993L297.78761061946904,475.4L366.8141592920354,443.9L435.8407079646018,432.19999999999993L504.86725663716817,430.4L573.8938053097346,472.7L642.920353982301,446.6L711.9469026548674,465.5L780.9734513274337,487.1","Maine":"M90.70796460176992,433.1000000000001L159.73451327433628,454.69999999999993L228.76106194690266,450.2L297.78761061946904,473.6L366.8141592920354,468.19999999999993L435.8407079646018,453.8L504.86725663716817,457.4L573.8938053097346,461.9L642.920353982301,467.30000000000007L711.9469026548674,459.2L780.9734513274337,461","Maryland":"M90.70796460176992,436.7L159.73451327433628,426.8L228.76106194690266,437.6L297.78761061946904,469.1L366.8141592920354,406.1L435.8407079646018,429.5L504.86725663716817,472.7L573.8938053097346,465.5L642.920353982301,423.2L711.9469026548674,447.5L780.9734513274337,422.30000000000007","Massachusetts":"M90.70796460176992,400.7L159.73451327433628,416L228.76106194690266,407L297.78761061946904,475.4L366.8141592920354,440.30000000000007L435.8407079646018,430.4L504.86725663716817,436.7L573.8938053097346,449.30000000000007L642.920353982301,442.1L711.9469026548674,436.7L780.9734513274337,417.80000000000007","Michigan":"M90.70796460176992,447.5L159.73451327433628,453.8L228.76106194690266,436.7L297.78761061946904,467.30000000000007L366.8141592920354,474.5L435.8407079646018,487.1L504.86725663716817,461.9L573.8938053097346,460.1L642.920353982301,491.6L711.9469026548674,457.4L780.9734513274337,477.19999999999993","Minnesota":"M90.70796460176992,446.6L159.73451327433628,454.69999999999993L228.76106194690266,457.4L297.78761061946904,445.69999999999993L366.8141592920354,425.9L435.8407079646018,453.8L504.86725663716817,437.6L573.8938053097346,445.69999999999993L642.920353982301,416L711.9469026548674,469.1L780.9734513274337,462.8","Mississippi":"M90.70796460176992,427.69999999999993L159.73451327433628,430.4L228.76106194690266,461L297.78761061946904,463.7L366.8141592920354,495.2L435.8407079646018,476.3L504.86725663716817,455.6L573.8938053097346,435.8L642.920353982301,473.6L711.9469026548674,439.4L780.9734513274337,423.2","Missouri":"M90.70796460176992,429.5L159.73451327433628,435.8L228.76106194690266,467.30000000000007L297.78761061946904,439.4L366.8141592920354,479L435.8407079646018,454.69999999999993L504.86725663716817,480.8L573.8938053097346,466.3999999999999L642.920353982301,486.2L711.9469026548674,445.69999999999993L780.9734513274337,471.80000000000007","Montana":"M90.70796460176992,463.7L159.73451327433628,459.2L228.76106194690266,437.6L297.78761061946904,447.5L366.8141592920354,473.6L435.8407079646018,506.8999999999999L504.86725663716817,495.2L573.8938053097346,514.1L642.920353982301,489.8L711.9469026548674,456.5L780.9734513274337,494.30000000000007","Nebraska":"M90.70796460176992,461L159.73451327433628,445.69999999999993L228.76106194690266,426.8L297.78761061946904,479.9L366.8141592920354,434L435.8407079646018,452.9L504.86725663716817,437.6L573.8938053097346,432.19999999999993L642.920353982301,422.30000000000007L711.9469026548674,479L780.9734513274337,447.5","Nevada":"M90.70796460176992,477.19999999999993L159.73451327433628,493.4L228.76106194690266,508.7L297.78761061946904,450.2L366.8141592920354,503.3L435.8407079646018,488L504.86725663716817,503.3L573.8938053097346,497L642.920353982301,465.5L711.9469026548674,471.80000000000007L780.9734513274337,466.3999999999999","New Hampshire":"M90.70796460176992,428.6L159.73451327433628,438.5L228.76106194690266,485.30000000000007L297.78761061946904,413.3L366.8141592920354,410.6000000000001L435.8407079646018,426.8L504.86725663716817,452L573.8938053097346,417.80000000000007L642.920353982301,452L711.9469026548674,436.7L780.9734513274337,413.3","New Jersey":"M90.70796460176992,438.5L159.73451327433628,428.6L228.76106194690266,512.3000000000001L297.78761061946904,440.30000000000007L366.8141592920354,459.2L435.8407079646018,470.9L504.86725663716817,497.9L573.8938053097346,505.1L642.920353982301,458.3L711.9469026548674,426.8L780.9734513274337,419.6","New Mexico":"M90.70796460176992,434.9L159.73451327433628,470.9L228.76106194690266,459.2L297.78761061946904,409.69999999999993L366.8141592920354,464.6L435.8407079646018,464.6L504.86725663716817,478.1L573.8938053097346,480.8L642.920353982301,442.1L711.9469026548674,480.8L780.9734513274337,478.1","New York":"M90.70796460176992,424.1L159.73451327433628,420.5L228.76106194690266,443.9L297.78761061946904,410.6000000000001L366.8141592920354,437.6L435.8407079646018,450.2L504.86725663716817,467.30000000000007L573.8938053097346,476.3L642.920353982301,461L711.9469026548674,468.19999999999993L780.9734513274337,420.5","North Carolina":"M90.70796460176992,418.7L159.73451327433628,419.6L228.76106194690266,430.4L297.78761061946904,450.2L366.8141592920354,407.9L435.8407079646018,450.2L504.86725663716817,443.9L573.8938053097346,429.5L642.920353982301,449.30000000000007L711.9469026548674,479L780.9734513274337,416","North Dakota":"M90.70796460176992,461.9L159.73451327433628,446.6L228.76106194690266,449.30000000000007L297.78761061946904,526.6999999999999L366.8141592920354,423.2L435.8407079646018,464.6L504.86725663716817,430.4L573.8938053097346,446.6L642.920353982301,417.80000000000007L711.9469026548674,464.6L780.9734513274337,457.4","Ohio":"M90.70796460176992,419.6L159.73451327433628,442.1L228.76106194690266,442.1L297.78761061946904,441.2L366.8141592920354,463.7L435.8407079646018,434.9L504.86725663716817,475.4L573.8938053097346,437.6L642.920353982301,440.30000000000007L711.9469026548674,467.30000000000007L780.9734513274337,506","Oklahoma":"M90.70796460176992,488L159.73451327433628,464.6L228.76106194690266,471.80000000000007L297.78761061946904,449.30000000000007L366.8141592920354,470.9L435.8407079646018,449.30000000000007L504.86725663716817,432.19999999999993L573.8938053097346,461L642.920353982301,434L711.9469026548674,470L780.9734513274337,471.80000000000007","Oregon":"M90.70796460176992,448.4L159.73451327433628,436.7L228.76106194690266,535.6999999999999L297.78761061946904,483.5L366.8141592920354,479.9L435.8407079646018,452L504.86725663716817,487.1L573.8938053097346,444.8L642.920353982301,464.6L711.9469026548674,494.30000000000007L780.9734513274337,475.4","Pennsylvania":"M90.70796460176992,433.1000000000001L159.73451327433628,425L228.76106194690266,437.6L297.78761061946904,418.7L366.8141592920354,435.8L435.8407079646018,450.2L504.86725663716817,476.3L573.8938053097346,449.30000000000007L642.920353982301,444.8L711.9469026548674,497L780.9734513274337,440.30000000000007","Rhode Island":"M90.70796460176992,437.6L159.73451327433628,419.6L228.76106194690266,423.2L297.78761061946904,514.1L366.8141592920354,427.69999999999993L435.8407079646018,436.7L504.86725663716817,462.8L573.8938053097346,417.80000000000007L642.920353982301,410.6000000000001L711.9469026548674,431.3L780.9734513274337,419.6","South Carolina":"M90.70796460176992,455.6L159.73451327433628,452L228.76106194690266,494.30000000000007L297.78761061946904,443.9L366.8141592920354,447.5L435.8407079646018,483.5L504.86725663716817,497.9L573.8938053097346,454.69999999999993L642.920353982301,476.3L711.9469026548674,441.2L780.9734513274337,477.19999999999993","South Dakota":"M90.70796460176992,458.3L159.73451327433628,436.7L228.76106194690266,430.4L297.78761061946904,459.2L366.8141592920354,425L435.8407079646018,436.7L504.86725663716817,444.8L573.8938053097346,451.1L642.920353982301,477.19999999999993L711.9469026548674,440.30000000000007L780.9734513274337,442.1","Tennessee":"M90.70796460176992,428.6L159.73451327433628,458.3L228.76106194690266,452L297.78761061946904,473.6L366.8141592920354,429.5L435.8407079646018,419.6L504.86725663716817,427.69999999999993L573.8938053097346,434.9L642.920353982301,460.1L711.9469026548674,450.2L780.9734513274337,449.30000000000007","Texas":"M90.70796460176992,457.4L159.73451327433628,477.19999999999993L228.76106194690266,478.1L297.78761061946904,458.3L366.8141592920354,466.3999999999999L435.8407079646018,436.7L504.86725663716817,483.5L573.8938053097346,453.8L642.920353982301,431.3L711.9469026548674,472.7L780.9734513274337,445.69999999999993","Utah":"M90.70796460176992,482.6L159.73451327433628,471.80000000000007L228.76106194690266,479L297.78761061946904,414.2L366.8141592920354,461.9L435.8407079646018,462.8L504.86725663716817,458.3L573.8938053097346,510.5L642.920353982301,480.8L711.9469026548674,494.30000000000007L780.9734513274337,446.6","Vermont":"M90.70796460176992,412.4L159.73451327433628,430.4L228.76106194690266,446.6L297.78761061946904,401.6L366.8141592920354,437.6L435.8407079646018,487.1L504.86725663716817,452.9L573.8938053097346,445.69999999999993L642.920353982301,422.30000000000007L711.9469026548674,454.69999999999993L780.9734513274337,459.2","Virginia":"M90.70796460176992,443.9L159.73451327433628,410.6000000000001L228.76106194690266,440.30000000000007L297.78761061946904,454.69999999999993L366.8141592920354,461.9L435.8407079646018,449.30000000000007L504.86725663716817,507.8L573.8938053097346,449.30000000000007L642.920353982301,479L711.9469026548674,431.3L780.9734513274337,482.6","Washington":"M90.70796460176992,438.5L159.73451327433628,449.30000000000007L228.76106194690266,464.6L297.78761061946904,438.5L366.8141592920354,465.5L435.8407079646018,459.2L504.86725663716817,462.8L573.8938053097346,471.80000000000007L642.920353982301,476.3L711.9469026548674,516.8000000000001L780.9734513274337,438.5","West Virginia":"M90.70796460176992,481.7L159.73451327433628,428.6L228.76106194690266,508.7L297.78761061946904,433.1000000000001L366.8141592920354,414.2L435.8407079646018,485.30000000000007L504.86725663716817,477.19999999999993L573.8938053097346,452L642.920353982301,507.8L711.9469026548674,518.6L780.9734513274337,506","Wisconsin":"M90.70796460176992,432.19999999999993L159.73451327433628,437.6L228.76106194690266,455.6L297.78761061946904,481.7L366.8141592920354,457.4L435.8407079646018,431.3L504.86725663716817,430.4L573.8938053097346,441.2L642.920353982301,425.9L711.9469026548674,476.3L780.9734513274337,441.2","Wyoming":"M159.73451327433628,445.69999999999993L228.76106194690266,475.4L297.78761061946904,434L366.8141592920354,492.5L435.8407079646018,491.6L504.86725663716817,458.3L573.8938053097346,447.5L642.920353982301,509.6L711.9469026548674,459.2L780.9734513274337,479"}
)