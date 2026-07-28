import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class BookingRescheduleScreen extends StatefulWidget {
  final String bookingTitle;

  const BookingRescheduleScreen({
    super.key,
    this.bookingTitle = "Euphoria Spa & Beauty Lounge",
  });

  @override
  State<BookingRescheduleScreen> createState() =>
      _BookingRescheduleScreenState();
}

class _BookingRescheduleScreenState extends State<BookingRescheduleScreen> {
  String? _selectedReason;
  final TextEditingController _messageController = TextEditingController();

  final List<String> _reasons = [
    "Change of plans",
    "Weather issues",
    "Sickness / Emergency",
    "Work conflict",
    "Other",
  ];

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _showReasonSelector() {
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
              "Select Reason",
              style: FTextStyle.header(context),
            ),
            const SizedBox(height: 14),
            Column(
              children: _reasons.map((reason) {
                final isSelected = reason == _selectedReason;
                return ListTile(
                  title: Text(reason, style: FTextStyle.tittle(context)),
                  trailing: isSelected
                      ? const Icon(Icons.check_circle_rounded,
                          color: AppColors.primary)
                      : null,
                  onTap: () {
                    setState(() {
                      _selectedReason = reason;
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
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                border: Border.all(color: const Color(0xFFEBEBEB)),
              ),
              child: const Icon(
                Icons.arrow_back,
                color: Colors.black,
                size: 20,
              ),
            ),
          ),
        ),
        title: Text(
          "Reschedule",
          style: FTextStyle.header(context).copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Reason for Schedule Change",
                      style: FTextStyle.header(context).copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 1. Select Reason Label
                    Text(
                      "Select Reason",
                      style: FTextStyle.tittle(context).copyWith(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 8),

                    GestureDetector(
                      onTap: _showReasonSelector,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFEBEBEB)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _selectedReason ?? "Placeholder",
                              style: FTextStyle.tittle(context).copyWith(
                                color: _selectedReason != null
                                    ? AppColors.textPrimary
                                    : const Color(0xFF9CA3B1),
                                fontSize: 15,
                              ),
                            ),
                            const Icon(
                              Icons.keyboard_arrow_down_rounded,
                              color: Color(0xFF757880),
                              size: 22,
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 2. Message Label
                    Text(
                      "Message",
                      style: FTextStyle.tittle(context).copyWith(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 8),

                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFEBEBEB)),
                      ),
                      child: TextField(
                        controller: _messageController,
                        maxLines: 5,
                        maxLength: 200,
                        decoration: const InputDecoration(
                          hintText: "Placeholder",
                          hintStyle: TextStyle(
                            color: Color(0xFF9CA3B1),
                            fontSize: 15,
                          ),
                          border: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          enabledBorder: InputBorder.none,
                        ),
                        onChanged: (text) {
                          setState(() {});
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Fixed Continue Button
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: "Continue",
                onPressed: () {
                  if (_selectedReason == null) {
                    CustomSnackBar.show(
                      context,
                      message: "Please select a reason!",
                      icon: Icons.warning_amber_rounded,
                    );
                    return;
                  }

                  CustomSnackBar.show(
                    context,
                    message: "Reschedule request submitted successfully!",
                    icon: Icons.check_circle_rounded,
                  );
                  Navigator.pop(context);
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
}
