import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';
import 'confirmToPay.dart';

class BookAppointmentsScreen extends StatefulWidget {
  final String serviceTitle;
  final String initialPackage;
  final String initialBeautician;
  final String price;

   BookAppointmentsScreen({
    super.key,
    this.serviceTitle = "Euphoria Spa & Beauty Lounge",
    this.initialPackage = "Basic",
    this.initialBeautician = "Aria Harris",
    this.price = "₹1,500.00",
  });

  @override
  State<BookAppointmentsScreen> createState() => _BookAppointmentsScreenState();
}

class _BookAppointmentsScreenState extends State<BookAppointmentsScreen> {
  String? _selectedPackage;
  String? _selectedBeautician;
  DateTime? _selectedDate;
  String? _selectedHour;
  bool _showValidationErrors = false;

  final List<String> _packages = ["Basic", "Standard", "Premium"];
  final List<String> _beauticians = [
    "Aria Harris",
    "Sophia W.",
    "Ava Davis",
    "Victoria L.",
  ];

  @override
  void initState() {
    super.initState();
    _selectedPackage = null;
    _selectedBeautician = null;
    _selectedDate = null;
    _selectedHour = null;
  }

  String _formatDate(DateTime date) {
    final List<String> months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return "${months[date.month - 1]}, ${date.day} ${date.year}";
  }

  void _showPackageSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Select Package",
              style: FTextStyle.tittle(context),
            ),
            const SizedBox(height: 14),
            Column(
              children: _packages.map((pkg) {
                final isSelected = pkg == _selectedPackage;
                return ListTile(
                  title: Text(pkg, style: FTextStyle.desc(context)),
                  trailing: isSelected
                      ? const Icon(Icons.check_circle_rounded,
                          color: AppColors.primary)
                      : null,
                  onTap: () {
                    setState(() {
                      _selectedPackage = pkg;
                    });
                    Navigator.pop(context);
                  },
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  void _showBeauticianSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Select Beautician",
              style: FTextStyle.tittle(context),
            ),
            const SizedBox(height: 14),
            Column(
              children: _beauticians.map((person) {
                final isSelected = person == _selectedBeautician;
                return ListTile(
                  leading: CircleAvatar(
                    backgroundColor: AppColors.primaryLight,
                    child: Text(
                      person[0],
                      style: FTextStyle.tittle(context),
                    ),
                  ),
                  title: Text(person, style: FTextStyle.tittle(context)),
                  trailing: isSelected
                      ? const Icon(Icons.check_circle_rounded,
                          color: AppColors.primary)
                      : null,
                  onTap: () {
                    setState(() {
                      _selectedBeautician = person;
                    });
                    Navigator.pop(context);
                  },
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  void _showHourSelector() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _TimePickerModalSheet(
        initialHour: _selectedHour ?? "",
        selectedDate: _selectedDate ?? DateTime.now(),
        onHourSelected: (hour) {
          setState(() {
            _selectedHour = hour;
          });
        },
      ),
    );
  }

  void _showCalendarDialog() {
    showDialog(
      context: context,
      builder: (context) => _AppointmentCalendarDialog(
        initialDate: _selectedDate ?? DateTime.now(),
        onDateSelected: (date) {
          setState(() {
            _selectedDate = date;
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Center(
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: const Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 20,
            ),
          ),
        ),
        title: Text(
          "Appointment",
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Package Field
                    _buildFormLabel(context, "Package"),
                    const SizedBox(height: 8),
                    _buildDropdownField(
                      context,
                      value: _selectedPackage,
                      placeholder: "Select Package",
                      onTap: _showPackageSelector,
                      isError: _showValidationErrors && _selectedPackage == null,
                      errorText: "Please select a package",
                    ),

                    const SizedBox(height: 10),

                    // 2. Beautician Field
                    _buildFormLabel(context, "Beautician"),
                    const SizedBox(height: 8),
                    _buildDropdownField(
                      context,
                      value: _selectedBeautician,
                      placeholder: "Select Beautician",
                      onTap: _showBeauticianSelector,
                      isError:
                          _showValidationErrors && _selectedBeautician == null,
                      errorText: "Please select a beautician",
                    ),

                    const SizedBox(height: 10),

                    // 3. Date Field
                    _buildFormLabel(context, "Date"),
                    const SizedBox(height: 8),
                    _buildDropdownField(
                      context,
                      value:
                          _selectedDate != null ? _formatDate(_selectedDate!) : null,
                      placeholder: "Select Date",
                      onTap: _showCalendarDialog,
                      isError: _showValidationErrors && _selectedDate == null,
                      errorText: "Please select a date",
                    ),

                    const SizedBox(height: 10),

                    // 4. Hours Field
                    _buildFormLabel(context, "Hours"),
                    const SizedBox(height: 8),
                    _buildDropdownField(
                      context,
                      value: _selectedHour,
                      placeholder: "Select Hours",
                      onTap: _showHourSelector,
                      isError: _showValidationErrors && _selectedHour == null,
                      errorText: "Please select a time slot",
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Fixed Action Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: "Continue",
                onPressed: () {
                  setState(() {
                    _showValidationErrors = true;
                  });

                  if (_selectedPackage == null) {
                    CustomSnackBar.show(
                      context,
                      message: "Please select a package!",
                      icon: Icons.warning_amber_rounded,
                    );
                    return;
                  }

                  if (_selectedBeautician == null) {
                    CustomSnackBar.show(
                      context,
                      message: "Please select a beautician!",
                      icon: Icons.warning_amber_rounded,
                    );
                    return;
                  }

                  if (_selectedDate == null) {
                    CustomSnackBar.show(
                      context,
                      message: "Please select a date!",
                      icon: Icons.warning_amber_rounded,
                    );
                    return;
                  }

                  if (_selectedHour == null) {
                    CustomSnackBar.show(
                      context,
                      message: "Please select a time slot!",
                      icon: Icons.warning_amber_rounded,
                    );
                    return;
                  }

                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ConfirmToPayScreen(
                        serviceTitle: widget.serviceTitle,
                        package: _selectedPackage!,
                        beautician: _selectedBeautician!,
                        bookingDate: _formatDate(_selectedDate!),
                        bookingHours: _selectedHour!,
                        price: widget.price,
                      ),
                    ),
                  );
                },
                height: 52,
                borderRadius: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormLabel(BuildContext context, String label) {
    return Text(
      label,
      style: FTextStyle.tittle(context),
    );
  }

  Widget _buildDropdownField(
    BuildContext context, {
    required String? value,
    required String placeholder,
    required VoidCallback onTap,
    bool isError = false,
    String? errorText,
  }) {
    final hasValue = value != null && value.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: onTap,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isError ? Colors.redAccent : const Color(0xFFEBEBEB),
                width: isError ? 1.5 : 1.0,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    hasValue ? value : placeholder,
                    style: FTextStyle.tittle(context).copyWith(
                      color: hasValue
                          ? AppColors.textPrimary
                          : const Color(0xFF9CA3B1),
                      fontSize: 15,
                      fontWeight:
                          hasValue ? FontWeight.w500 : FontWeight.normal,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  Icons.keyboard_arrow_down_rounded,
                  color: isError ? Colors.redAccent : const Color(0xFF757880),
                  size: 22,
                ),
              ],
            ),
          ),
        ),
        if (isError && errorText != null) ...[
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.only(left: 4),
            child: Text(
              errorText,
              style: FTextStyle.desc(context).copyWith(
                color: Colors.redAccent,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ],
    );
  }
}

// Custom Calendar Dialog matching Figma Image 2
class _AppointmentCalendarDialog extends StatefulWidget {
  final DateTime initialDate;
  final ValueChanged<DateTime> onDateSelected;

   _AppointmentCalendarDialog({
    required this.initialDate,
    required this.onDateSelected,
  });

  @override
  State<_AppointmentCalendarDialog> createState() => __AppointmentCalendarDialogState();
}

class __AppointmentCalendarDialogState
    extends State<_AppointmentCalendarDialog> {
  late DateTime _displayedMonth;
  late DateTime _tempSelectedDate;

  @override
  void initState() {
    super.initState();
    _tempSelectedDate = widget.initialDate;
    _displayedMonth = DateTime(widget.initialDate.year, widget.initialDate.month);
  }

  bool get _canGoPrevMonth {
    final now = DateTime.now();
    final currentMonthStart = DateTime(now.year, now.month, 1);
    return _displayedMonth.isAfter(currentMonthStart);
  }

  void _nextMonth() {
    setState(() {
      _displayedMonth = DateTime(_displayedMonth.year, _displayedMonth.month + 1);
    });
  }

  void _prevMonth() {
    if (_canGoPrevMonth) {
      setState(() {
        _displayedMonth =
            DateTime(_displayedMonth.year, _displayedMonth.month - 1);
      });
    }
  }

  String _getMonthName(int month) {
    final List<String> months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return months[month - 1];
  }

  @override
  Widget build(BuildContext context) {
    final daysInMonth =
        DateUtils.getDaysInMonth(_displayedMonth.year, _displayedMonth.month);
    final firstDayOfWeek =
        DateTime(_displayedMonth.year, _displayedMonth.month, 1).weekday % 7;

    final prevMonthDays = DateUtils.getDaysInMonth(
        _displayedMonth.month == 1
            ? _displayedMonth.year - 1
            : _displayedMonth.year,
        _displayedMonth.month == 1 ? 12 : _displayedMonth.month - 1);

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding:  EdgeInsets.fromLTRB(20, 20, 20, 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Month-Year Navigation Header (< December 2024 >)
            Row(
              children: [
                IconButton(
                  onPressed: _canGoPrevMonth ? _prevMonth : null,
                  padding: EdgeInsets.zero,
                  constraints:  BoxConstraints(minWidth: 36, minHeight: 36),
                  icon: Icon(
                    Icons.chevron_left_rounded,
                    color: _canGoPrevMonth
                        ? Colors.black
                        :  Color(0xFFD0D4DC),
                    size: 24,
                  ),
                ),
                Expanded(
                  child: Text(
                    "${_getMonthName(_displayedMonth.month)} ${_displayedMonth.year}",
                    textAlign: TextAlign.center,
                    style: FTextStyle.tittle(context).copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                IconButton(
                  onPressed: _nextMonth,
                  padding: EdgeInsets.zero,
                  constraints: BoxConstraints(minWidth: 36, minHeight: 36),
                  icon:  Icon(
                    Icons.chevron_right_rounded,
                    color: Colors.black,
                    size: 24,
                  ),
                ),
              ],
            ),

             SizedBox(height: 16),

            // Weekday Labels Row (SUM MON TUE WED THU FRI SAT)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children:  [
                _WeekdayLabel("SUM"),
                _WeekdayLabel("MON"),
                _WeekdayLabel("TUE"),
                _WeekdayLabel("WED"),
                _WeekdayLabel("THU"),
                _WeekdayLabel("FRI"),
                _WeekdayLabel("SAT"),
              ],
            ),

             SizedBox(height: 12),

            // 7-Column Calendar Days Grid
            GridView.builder(
              shrinkWrap: true,
              physics:  NeverScrollableScrollPhysics(),
              itemCount: 35, // 5 rows x 7 days
              gridDelegate:  SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 7,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
              ),
              itemBuilder: (context, index) {
                int dayNumber;
                bool isCurrentMonth = true;
                DateTime cellDate;

                if (index < firstDayOfWeek) {
                  isCurrentMonth = false;
                  dayNumber = prevMonthDays - (firstDayOfWeek - index - 1);
                  cellDate = DateTime(
                    _displayedMonth.month == 1
                        ? _displayedMonth.year - 1
                        : _displayedMonth.year,
                    _displayedMonth.month == 1 ? 12 : _displayedMonth.month - 1,
                    dayNumber,
                  );
                } else if (index >= firstDayOfWeek + daysInMonth) {
                  isCurrentMonth = false;
                  dayNumber = index - (firstDayOfWeek + daysInMonth) + 1;
                  cellDate = DateTime(
                    _displayedMonth.month == 12
                        ? _displayedMonth.year + 1
                        : _displayedMonth.year,
                    _displayedMonth.month == 12 ? 1 : _displayedMonth.month + 1,
                    dayNumber,
                  );
                } else {
                  dayNumber = index - firstDayOfWeek + 1;
                  cellDate = DateTime(_displayedMonth.year,
                      _displayedMonth.month, dayNumber);
                }

                final isPastDate = cellDate.isBefore(today);
                final isSelected = isCurrentMonth &&
                    !isPastDate &&
                    cellDate.year == _tempSelectedDate.year &&
                    cellDate.month == _tempSelectedDate.month &&
                    cellDate.day == _tempSelectedDate.day;

                return GestureDetector(
                  onTap: () {
                    if (isCurrentMonth && !isPastDate) {
                      setState(() {
                        _tempSelectedDate = cellDate;
                      });
                    }
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary : Colors.transparent,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      "$dayNumber",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected
                            ? Colors.white
                            : (!isCurrentMonth || isPastDate)
                                ?  Color(0xFFD0D4DC)
                                : AppColors.textPrimary,
                      ),
                    ),
                  ),
                );
              },
            ),

             SizedBox(height: 24),

            // Dialog Action Buttons (Cancel / Apply)
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryLight,
                      foregroundColor: AppColors.primary,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding:  EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(
                      "Cancel",
                      style: FTextStyle.tittle(context).copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                 SizedBox(width: 14),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      widget.onDateSelected(_tempSelectedDate);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding:  EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(
                      "Apply",
                      style: FTextStyle.tittle(context).copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _WeekdayLabel extends StatelessWidget {
  final String text;
   _WeekdayLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Text(
        text,
        textAlign: TextAlign.center,
        style:  TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Color(0xFF9CA3B1),
        ),
      ),
    );
  }
}

class _TimePickerModalSheet extends StatefulWidget {
  final String initialHour;
  final DateTime selectedDate;
  final ValueChanged<String> onHourSelected;

   _TimePickerModalSheet({
    required this.initialHour,
    required this.selectedDate,
    required this.onHourSelected,
  });

  @override
  State<_TimePickerModalSheet> createState() => _TimePickerModalSheetState();
}

class _TimePickerModalSheetState extends State<_TimePickerModalSheet> {
  late String _tempSelectedHour;
  int _activePeriodIndex = 0; // 0: Morning, 1: Afternoon, 2: Evening

  final Map<String, List<String>> _timePeriods = {
    "Morning": ["09.00 AM", "09.30 AM", "10.00 AM", "10.30 AM", "11.00 AM", "11.30 AM"],
    "Afternoon": ["12.00 PM", "12.30 PM", "01.00 PM", "01.30 PM", "02.00 PM", "03.00 PM"],
    "Evening": ["04.00 PM", "05.00 PM", "06.00 PM", "06.30 PM", "07.00 PM", "08.00 PM"],
  };

  @override
  void initState() {
    super.initState();
    _tempSelectedHour = widget.initialHour;
  }

  Future<void> _pickCustomTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime:  TimeOfDay(hour: 11, minute: 0),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme:  ColorScheme.light(
              primary: AppColors.primary,
              onPrimary: Colors.white,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      final hour = picked.hourOfPeriod == 0 ? 12 : picked.hourOfPeriod;
      final minute = picked.minute.toString().padLeft(2, '0');
      final period = picked.period == DayPeriod.am ? "AM" : "PM";
      final formatted = "${hour.toString().padLeft(2, '0')}.$minute $period";

      setState(() {
        _tempSelectedHour = formatted;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final periodKeys = _timePeriods.keys.toList();
    final currentSlots = _timePeriods[periodKeys[_activePeriodIndex]]!;

    return Container(
      padding:  EdgeInsets.fromLTRB(20, 16, 20, 28),
      decoration:  BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Drag Handle
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color:  Color(0xFFE0E1E6),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),

             SizedBox(height: 16),

            // Header Title + Custom Clock Icon
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Select Time Slot",
                  style: FTextStyle.header(context).copyWith(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                GestureDetector(
                  onTap: _pickCustomTime,
                  child: Container(
                    padding:  EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                         Icon(
                          Icons.access_time_filled_rounded,
                          color: AppColors.primary,
                          size: 16,
                        ),
                         SizedBox(width: 4),
                        Text(
                          "Custom",
                          style: FTextStyle.desc(context).copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

             SizedBox(height: 16),

            // Time Period Filter Tabs (Morning / Afternoon / Evening)
            Row(
              children: List.generate(periodKeys.length, (idx) {
                final isSelected = _activePeriodIndex == idx;
                return Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _activePeriodIndex = idx;
                      });
                    },
                    child: Container(
                      margin:  EdgeInsets.symmetric(horizontal: 4),
                      padding:  EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.primary
                            :  Color(0xFFF5F6F8),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        periodKeys[idx],
                        textAlign: TextAlign.center,
                        style: FTextStyle.desc(context).copyWith(
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight:
                              isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                );
              }),
            ),

             SizedBox(height: 20),

            // Time Slots Grid
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: currentSlots.map((slot) {
                final isSelected = slot == _tempSelectedHour;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _tempSelectedHour = slot;
                    });
                  },
                  child: Container(
                    padding:  EdgeInsets.symmetric(
                        horizontal: 16, vertical: 11),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primary
                          :  Color(0xFFFAFAFC),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primary
                            :  Color(0xFFEBEBEB),
                      ),
                    ),
                    child: Text(
                      slot,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.w500,
                        color:
                            isSelected ? Colors.white : AppColors.textPrimary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),

             SizedBox(height: 24),

            // Dialog Action Buttons (Cancel / Apply)
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryLight,
                      foregroundColor: AppColors.primary,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding:  EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(
                      "Cancel",
                      style: FTextStyle.tittle(context).copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                 SizedBox(width: 14),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      widget.onHourSelected(_tempSelectedHour);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding:  EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(
                      "Apply",
                      style: FTextStyle.tittle(context).copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}