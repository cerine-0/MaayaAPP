import { supabase } from '@/lib/supabase';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export const ProviderHomeScreen = ({ providerData, onLogout }) => {
    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch help requests with user information
    const fetchHelpRequests = async () => {
        try {
            setLoading(true);
            
            // Fetch requests from the requests table (or help_requests)
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching requests:', error);
                Alert.alert('Erreur', `Erreur: ${error.message}`);
                setHelpRequests([]);
            } else {
                console.log('Fetched requests:', data);
                setHelpRequests(data || []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            Alert.alert('Erreur', 'Une erreur est survenue: ' + err.message);
            setHelpRequests([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        fetchHelpRequests();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHelpRequests();
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Aujourd'hui";
        if (diffInHours < 24) return `${diffInHours}H`;
        if (diffInHours < 48) return '1J';
        return `${Math.floor(diffInHours / 24)}J`;
    };

    const openUserDetails = (request) => {
        setSelectedUser(request);
        setShowModal(true);
    };

    const RequestCard = ({ request }) => {
        return (
            <TouchableOpacity
                style={styles.requestCard}
                onPress={() => openUserDetails(request)}
            >
                <View style={styles.cardContent}>
                    <View style={styles.avatarContainer}>
                        <Feather name="user" size={32} color="#F37C62" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.userName}>{request?.name || request?.nom || 'Nom non disponible'}</Text>
                        <Text style={styles.requestDescription}>
                            {request.type || 'Aide'} - {request.description || 'Pas de description'}
                        </Text>
                        <Text style={{ color: '#F37C62', fontWeight: '600' }}>
                            {request.urgency || 'Normal'}
                        </Text>
                    </View>
                    <Text style={styles.timeText}>{formatTime(request.created_at)}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    const UserDetailModal = () => {
        const user = selectedUser?.user;

        return (
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Détails de l'utilisateur</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Feather name="x" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <View style={styles.modalAvatarContainer}>
                                <View style={styles.modalAvatar}>
                                    <Feather name="user" size={48} color="#7a9b9e" />
                                </View>
                                <Text style={styles.modalUserName}>{user?.nom_prenom}</Text>
                            </View>

                            <View style={styles.detailSection}>
                                <Text style={styles.sectionTitle}>Informations personnelles</Text>

                                <View style={styles.detailItem}>
                                    <Feather name="calendar" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Âge</Text>
                                        <Text style={styles.detailValue}>{user?.age || 'Non spécifié'} ans</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <Feather name="calendar" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Date de naissance</Text>
                                        <Text style={styles.detailValue}>{user?.date_naissance || 'Non spécifiée'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <Feather name="users" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Genre</Text>
                                        <Text style={styles.detailValue}>{user?.genre || 'Non spécifié'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <Feather name="phone" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Téléphone</Text>
                                        <Text style={styles.detailValue}>{user?.numero_telephone || 'Non disponible'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <Feather name="mail" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Email</Text>
                                        <Text style={styles.detailValue}>{user?.email || 'Non disponible'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <Feather name="map-pin" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Adresse</Text>
                                        <Text style={styles.detailValue}>{user?.adresse || 'Non spécifiée'}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.detailSection}>
                                <Text style={styles.sectionTitle}>Informations de santé</Text>

                                <View style={styles.detailItem}>
                                    <Feather name="activity" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Poids</Text>
                                        <Text style={styles.detailValue}>{user?.poids ? `${user.poids} kg` : 'Non spécifié'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <Feather name="arrow-up" size={18} color="#7a9b9e" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Taille</Text>
                                        <Text style={styles.detailValue}>{user?.taille ? `${user.taille} cm` : 'Non spécifiée'}</Text>
                                    </View>
                                </View>

                                {user?.maladies_chroniques && (
                                    <View style={styles.detailItem}>
                                        <Feather name="alert-circle" size={18} color="#F37C62" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Maladies chroniques</Text>
                                            <Text style={styles.detailValue}>{user.maladies_chroniques}</Text>
                                        </View>
                                    </View>
                                )}

                                {user?.allergies && (
                                    <View style={styles.detailItem}>
                                        <Feather name="alert-triangle" size={18} color="#F59E0B" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Allergies</Text>
                                            <Text style={styles.detailValue}>{user.allergies}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {user?.responsable_legal && (
                                <View style={styles.detailSection}>
                                    <Text style={styles.sectionTitle}>Contact d'urgence</Text>

                                    <View style={styles.detailItem}>
                                        <Feather name="user" size={18} color="#7a9b9e" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Responsable légal</Text>
                                            <Text style={styles.detailValue}>{user.responsable_legal}</Text>
                                        </View>
                                    </View>

                                    {user?.telephone_responsable && (
                                        <View style={styles.detailItem}>
                                            <Feather name="phone" size={18} color="#7a9b9e" />
                                            <View style={styles.detailTextContainer}>
                                                <Text style={styles.detailLabel}>Téléphone</Text>
                                                <Text style={styles.detailValue}>{user.telephone_responsable}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.callButton}>
                                <Feather name="phone" size={20} color="#fff" />
                                <Text style={styles.callButtonText}>Appeler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptButton}>
                                <Feather name="check" size={20} color="#fff" />
                                <Text style={styles.acceptButtonText}>Accepter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with Logo */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarHeader}>
                        <Feather name="user" size={24} color="#7a9b9e" />
                    </View>
                    <View>
                        <Text style={styles.providerName}>{providerData?.fullName || 'John Doe'}</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Image
                        source={require('../assets/Rectangle.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                </View>
            </View>

            {/* Date Tabs */}
            <View style={styles.dateTabs}>
                <TouchableOpacity style={styles.dateTabActive}>
                    <Text style={styles.dateTabTextActive}>Aujourd'hui</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateTab}>
                    <Text style={styles.dateTabText}>Marquer tout</Text>
                </TouchableOpacity>
            </View>

            {/* Requests List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F37C62" />
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            ) : helpRequests.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Feather name="inbox" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyText}>Aucune demande</Text>
                </View>
            ) : (
                <>
                    <ScrollView
                        style={styles.requestsList}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {helpRequests.map((request) => (
                            <RequestCard key={request.id} request={request} />
                        ))}
                        <View style={styles.yesterdaySection}>
                            <Text style={styles.yesterdayText}>hier</Text>
                        </View>
                        <View style={styles.bottomPadding} />
                    </ScrollView>
                </>
            )}

            {/* User Detail Modal */}
            <UserDetailModal />

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="user" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemCenter}>
                    <View style={styles.centerButton}>
                        <Feather name="bell" size={28} color="#fff" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="phone" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF6EA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#FAF6EA',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarHeader: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#D3E6DC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 14,
        color: '#7a9b9e',
    },
    providerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F37C62',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 50,
        height: 50,
    },
    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F37C62',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    notificationCount: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    dateTabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 16,
    },
    dateTabActive: {
        backgroundColor: '#B8E6D5',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    dateTabTextActive: {
        color: '#1F2937',
        fontSize: 14,
        fontWeight: '600',
    },
    dateTab: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    dateTabText: {
        color: '#F37C62',
        fontSize: 14,
        fontWeight: '500',
    },
    requestsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    requestCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFE5E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    requestDescription: {
        fontSize: 13,
        color: '#7a9b9e',
    },
    timeText: {
        fontSize: 13,
        color: '#7a9b9e',
        fontWeight: '500',
    },
    yesterdaySection: {
        alignItems: 'center',
        marginVertical: 16,
    },
    yesterdayText: {
        fontSize: 14,
        color: '#7a9b9e',
        backgroundColor: '#D3E6DC',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#7a9b9e',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#7a9b9e',
    },
    bottomPadding: {
        height: 20,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#F37C62',
        paddingVertical: 16,
        paddingHorizontal: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navItem: {
        alignItems: 'center',
    },
    navItemCenter: {
        alignItems: 'center',
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F37C62',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -32,
        borderWidth: 5,
        borderColor: '#FAF6EA',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FAF6EA',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    modalBody: {
        padding: 20,
    },
    modalAvatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D3E6DC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalUserName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    detailSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    detailTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#7a9b9e',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    modalActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
    },
    callButton: {
        flex: 1,
        backgroundColor: '#9CCFC7',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    callButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#F37C62',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});