import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class BookingRescheduleScreen extends StatefulWidget {
  final String bookingTitle;

   BookingRescheduleScreen({
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
      shape:  RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding:  EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              Constants.selectReason,
              style: FTextStyle.header(context),
            ),
             SizedBox(height: 4),
            Column(
              children: _reasons.map((reason) {
                final isSelected = reason == _selectedReason;
                return ListTile(
                  title: Text(reason, style: FTextStyle.tittle(context)),
                  trailing: isSelected
                      ?  Icon(Icons.check_circle_rounded,
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
            child: Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 20,
            ),
          ),
        ),
        title: Text(
          Constants.reschedule,
          style: FTextStyle.header(context)
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding:  EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      Constants.reason,
                      style: FTextStyle.tittle(context)
                    ),

                     SizedBox(height: 10),

                    // 1. Select Reason Label
                    Text(
                      Constants.selectReasonPlaceholder,
                      style: FTextStyle.tittle(context)
                    ),
                     SizedBox(height: 8),

                    GestureDetector(
                      onTap: _showReasonSelector,
                      child: Container(
                        width: double.infinity,
                        padding:  EdgeInsets.symmetric(
                            horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color:  Color(0xFFEBEBEB)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _selectedReason ?? "Placeholder",
                              style: FTextStyle.textfieldHintText(context),
                            ),
                             Icon(
                              Icons.keyboard_arrow_down_rounded,
                              color: Color(0xFF757880),
                              size: 22,
                            ),
                          ],
                        ),
                      ),
                    ),

                     SizedBox(height: 10),

                    // 2. Message Label
                    Text(
                      Constants.message,
                      style: FTextStyle.tittle(context)
                    ),
                     SizedBox(height: 8),
                    Container(
                      padding:  EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color:  Color(0xFFEBEBEB)),
                      ),
                      child: TextField(
                        controller: _messageController,
                        maxLines: 5,
                        maxLength: 200,
                        decoration:  InputDecoration(
                          hintText: Constants.placeholderMessage,
                          hintStyle: FTextStyle.textfieldHintText(context),
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
              padding:  EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: Constants.continueText,
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
                    backgroundColor: AppColors.add,
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
