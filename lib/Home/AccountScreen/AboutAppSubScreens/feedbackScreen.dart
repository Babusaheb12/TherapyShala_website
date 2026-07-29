import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class FeedbackScreen extends StatefulWidget {
  FeedbackScreen({super.key});

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  int _selectedRating = 5;
  String _selectedCategory = Constants.appExperience;
  final TextEditingController _feedbackController = TextEditingController();

  final List<String> _categories = [
    Constants.appExperience,
    Constants.serviceQuality,
    Constants.beauticianBehavior,
    Constants.suggestion,
    Constants.bugReport,
  ];

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
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
              size: 18,
            ),
          ),
        ),
        title: Text(
          Constants.feedback,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      Constants.rateYourExperience,
                      style: FTextStyle.header(context),
                    ),
                    SizedBox(height: 12),

                    // Star Rating Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        final starNumber = index + 1;
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedRating = starNumber;
                            });
                          },
                          child: Padding(
                            padding: EdgeInsets.symmetric(horizontal: 6),
                            child: Icon(
                              starNumber <= _selectedRating
                                  ? Icons.star_rounded
                                  : Icons.star_outline_rounded,
                              color: starNumber <= _selectedRating
                                  ? Color(0xFFFDBB3E)
                                  : AppColors.border,
                              size: 38,
                            ),
                          ),
                        );
                      }),
                    ),

                    SizedBox(height: 24),

                    // Feedback Category
                    Text(
                      Constants.category,
                      style: FTextStyle.header(context),
                    ),
                    SizedBox(height: 8),
                    Container(
                      height: 52,
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Color(0xFFEBEBEB)),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedCategory,
                          isExpanded: true,
                          icon: Icon(
                            Icons.keyboard_arrow_down_rounded,
                            color: AppColors.textSecondary,
                          ),
                          items: _categories.map((cat) {
                            return DropdownMenuItem<String>(
                              value: cat,
                              child: Text(
                                cat,
                                style: FTextStyle.tittle(context),
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) {
                              setState(() {
                                _selectedCategory = val;
                              });
                            }
                          },
                        ),
                      ),
                    ),

                    SizedBox(height: 20),

                    // Feedback Input Area
                    Text(
                      Constants.yourFeedback,
                      style: FTextStyle.header(context),
                    ),
                    SizedBox(height: 8),
                    Container(
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Color(0xFFEBEBEB)),
                      ),
                      child: TextField(
                        controller: _feedbackController,
                        maxLines: 5,
                        style: FTextStyle.tittle(context),
                        decoration: InputDecoration(
                          hintText: Constants.shareYourFeedbackOrSuggestionsWithUs,
                          hintStyle: FTextStyle.desc(context),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Action Button
            Padding(
              padding: EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: Constants.submitFeedback,
                onPressed: () {
                  if (_feedbackController.text.trim().isEmpty) {
                    CustomSnackBar.show(
                      context,
                      message: Constants.pleaseEnterYourFeedbackBeforeSubmitting,
                      icon: Icons.warning_amber_rounded,
                    );
                    return;
                  }
                  CustomSnackBar.show(
                    context,
                    message: Constants.thankYouForYourValuableFeedback,
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
