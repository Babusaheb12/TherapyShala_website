import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class PersonalDataScreen extends StatefulWidget {
  PersonalDataScreen({super.key});

  @override
  State<PersonalDataScreen> createState() => _PersonalDataScreenState();
}

class _PersonalDataScreenState extends State<PersonalDataScreen> {
  final TextEditingController _nameController =
      TextEditingController(text: "Amelia Wilson");
  final TextEditingController _emailController =
      TextEditingController(text: "ameliawilson@gmail.com");
  final TextEditingController _phoneController =
      TextEditingController(text: "(409) 487-1935");
  final TextEditingController _dobController =
      TextEditingController(text: "December 20, 1998");

  String _selectedGender = "Female";
  final List<String> _genders = ["Female", "Male", "Other"];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(1998, 12, 20),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        _dobController.text =
            "${_getMonthName(picked.month)} ${picked.day}, ${picked.year}";
      });
    }
  }

  String _getMonthName(int month) {
    const months = [
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
          Constants.personalData,
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
                    // Profile Image with Edit Icon Badge
                    Center(
                      child: Stack(
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Color(0xFFFCE4EC),
                              image: DecorationImage(
                                image: NetworkImage(
                                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                                ),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 4,
                            child: Container(
                              padding: EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                              child: Icon(
                                Icons.edit_rounded,
                                color: Colors.white,
                                size: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 4),

                    // Full Name
                    _buildLabel(Constants.full_name),
                    SizedBox(height: 8),
                    _buildTextField(_nameController),

                    SizedBox(height: 16),

                    // Email
                    _buildLabel(Constants.email),
                    SizedBox(height: 8),
                    _buildTextField(_emailController, keyboardType: TextInputType.emailAddress),

                    SizedBox(height: 16),

                    // Phone Number
                    _buildLabel(Constants.mNo),
                    SizedBox(height: 8),
                    Container(
                      height: 52,
                      padding: EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Color(0xFFEBEBEB)),
                      ),
                      child: Row(
                        children: [
                          Text( "🇮🇳", style: TextStyle(fontSize: 18)),
                          SizedBox(width: 6),
                          Text(
                            Constants.countryCode,
                            style: FTextStyle.tittle(context)
                          ),
                          // Icon(
                          //   Icons.keyboard_arrow_down_rounded,
                          //   color: AppColors.textSecondary,
                          //   size: 20,
                          // ),
                          // SizedBox(width: 8),
                          VerticalDivider(
                            color: Color(0xFFEBEBEB),
                            thickness: 1,
                            indent: 12,
                            endIndent: 12,
                          ),
                          SizedBox(width: 8),
                          Expanded(
                            child: TextField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              style: FTextStyle.tittle(context),
                              decoration: InputDecoration(
                                border: InputBorder.none,
                                isDense: true,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 16),

                    // Date of Birth
                    _buildLabel(Constants.dob),
                    SizedBox(height: 8),
                    GestureDetector(
                      onTap: _selectDate,
                      child: AbsorbPointer(
                        child: _buildTextField(
                          _dobController,
                          suffixIcon: Icons.calendar_today_outlined,
                        ),
                      ),
                    ),

                    SizedBox(height: 16),

                    // Gender Dropdown
                    _buildLabel(Constants.gender),
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
                          value: _selectedGender,
                          isExpanded: true,
                          icon: Icon(
                            Icons.keyboard_arrow_down_rounded,
                            color: AppColors.textSecondary,
                          ),
                          items: _genders.map((gender) {
                            return DropdownMenuItem<String>(
                              value: gender,
                              child: Text(
                                gender,
                                style: FTextStyle.tittle(context),
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) {
                              setState(() {
                                _selectedGender = val;
                              });
                            }
                          },
                        ),
                      ),
                    ),

                    SizedBox(height: 20),
                  ],
                ),
              ),
            ),

            // Bottom Save Changes Button
            Padding(
              padding: EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: Constants.saveChanges,
                onPressed: () {
                  CustomSnackBar.show(
                    context,
                    message: Constants.personalDataUpdated,
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

  Widget _buildLabel(String label) {
    return Text(
      label,
      style: FTextStyle.header(context)
    );
  }

  Widget _buildTextField(
    TextEditingController controller, {
    TextInputType keyboardType = TextInputType.text,
    IconData? suffixIcon,
  }) {
    return Container(
      height: 52,
      padding: EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Color(0xFFEBEBEB)),
      ),
      child: Center(
        child: TextField(
          controller: controller,
          keyboardType: keyboardType,
          style: FTextStyle.tittle(context),
          decoration: InputDecoration(
            border: InputBorder.none,
            isDense: true,
            suffixIcon: suffixIcon != null
                ? Icon(
                    suffixIcon,
                    color: AppColors.textSecondary,
                    size: 20,
                  )
                : null,
          ),
        ),
      ),
    );
  }
}
