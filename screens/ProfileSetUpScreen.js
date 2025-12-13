
// Complete Profile Setup Screen - All in One
export const ProfileSetupScreen = ({ onComplete, goBack }) => {
  // Personal Info
  const [nomPrenom, setNomPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [age, setAge] = useState('');
  const [adresse, setAdresse] = useState('');
  
  // Medical & Legal Info
  const [conditions, setConditions] = useState('');
  const [besoins, setBesoins] = useState('');
  const [responsable, setResponsable] = useState('');
  const [telephoneContact, setTelephoneContact] = useState('');
  const [genre, setGenre] = useState('');
  
  // Health Info
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [maladies, setMaladies] = useState('');
  const [allergies, setAllergies] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!nomPrenom || !telephone || !adresse) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: nomPrenom,
          phone: telephone,
          age: age,
          address: adresse,
          conditions,
          besoins,
          responsable,
          telephone_contact: telephoneContact,
          genre,
          poids,
          taille,
          maladies,
          allergies,
          profile_completed: true,
        });

      setLoading(false);

      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Succès', 'Profile complété avec succès!');
        if (onComplete) {
          onComplete();
        }
      }
    } else {
      setLoading(false);
      Alert.alert('Erreur', 'Utilisateur non connecté');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.card}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>← Profile Setup</Text>
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤</Text>
            <View style={styles.editIcon}>
              <Text>✏️</Text>
            </View>
          </View>
        </View>

        {/* SECTION 1: Personal Information */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom et Prénom</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Quincy williams!"
              placeholderTextColor="#7a9b9e"
              value={nomPrenom}
              onChangeText={setNomPrenom}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numéro de téléphone</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.inputIcon}>📞</Text>
            <TextInput
              style={styles.inputField}
              placeholder="+44 7583 123456"
              placeholderTextColor="#7a9b9e"
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder="Entrez votre adresse"
              placeholderTextColor="#7a9b9e"
              value={adresse}
              onChangeText={setAdresse}
            />
          </View>
        </View>

        {/* SECTION 2: Medical & Legal Information */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Conditions</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={conditions}
              onChangeText={setConditions}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Besoins</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={besoins}
              onChangeText={setBesoins}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Responsable Légal</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={responsable}
              onChangeText={setResponsable}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Son numéro de téléphone</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={telephoneContact}
              onChangeText={setTelephoneContact}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Genre</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={genre}
              onChangeText={setGenre}
            />
          </View>
        </View>

        {/* SECTION 3: Health Information */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Poids</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={poids}
              onChangeText={setPoids}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Taille</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={taille}
              onChangeText={setTaille}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maladies croniques</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={maladies}
              onValueChange={setMaladies}
              style={styles.picker}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Aucune" value="none" />
              <Picker.Item label="Diabète" value="diabetes" />
              <Picker.Item label="Hypertension" value="hypertension" />
              <Picker.Item label="Asthme" value="asthma" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Allergies</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder=""
              placeholderTextColor="#7a9b9e"
              value={allergies}
              onChangeText={setAllergies}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : 'S\'inscrire →'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  card: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f1e8',
    borderRadius: 0,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoEmoji: {
    fontSize: 36,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2d3436',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#d4e6e8',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 0,
    color: '#2d3436',
  },
  inputWithIcon: {
    backgroundColor: '#d4e6e8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    padding: 0,
  },
  eyeIcon: {
    padding: 5,
  },
  eyeIconText: {
    fontSize: 20,
  },
  pickerContainer: {
    backgroundColor: '#d4e6e8',
    borderRadius: 12,
    borderWidth: 0,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2d3436',
  },
  button: {
    backgroundColor: '#ff8175',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ff8175',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#d4e6e8',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
  },
  googleIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#636e72',
    fontSize: 14,
  },
  footerLink: {
    textAlign: 'center',
    marginTop: 10,
    color: '#00b894',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  link: {
    color: '#00b894',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff4757',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  errorText: {
    color: '#ff4757',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  backButton: {
    marginBottom: 20,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2d3436',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarIcon: {
    fontSize: 48,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2d3436',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});