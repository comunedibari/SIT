import xml.etree.ElementTree as ET

NS0 = 'http://www.isotc211.org/2005/gmd'
NS1 = 'http://www.isotc211.org/2005/gco'
NS2 = 'http://www.isotc211.org/2005/srv'

def build(**kwargs):
	MD_MetadataXMLTag1 = ET.Element('{%s}MD_Metadata' % NS0)
	fileIdentifierXMLTag2 = ET.SubElement(MD_MetadataXMLTag1, '{%s}fileIdentifier' % NS0)
	CharacterStringXMLTag3 = ET.SubElement(fileIdentifierXMLTag2, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag3.text = kwargs.get('', 'R_SARDEG:FZGFZ') # PARAMETERIZE
	languageXMLTag4 = ET.SubElement(MD_MetadataXMLTag1, '{%s}language' % NS0)
	LanguageCodeXMLTag5 = ET.SubElement(languageXMLTag4, '{%s}LanguageCode' % NS0)
	LanguageCodeXMLTag5.text = kwargs.get('', 'ita') # PARAMETERIZE
	LanguageCodeXMLTag5.set('codeList', kwargs.get('', 'http://www.loc.gov/standards/iso639-2 ')) # PARAMETERIZE
	LanguageCodeXMLTag5.set('codeListValue', kwargs.get('', 'ita')) # PARAMETERIZE
	characterSetXMLTag6 = ET.SubElement(MD_MetadataXMLTag1, '{%s}characterSet' % NS0)
	MD_CharacterSetCodeXMLTag7 = ET.SubElement(characterSetXMLTag6, '{%s}MD_CharacterSetCode' % NS0)
	MD_CharacterSetCodeXMLTag7.text = kwargs.get('', 'utf8') # PARAMETERIZE
	MD_CharacterSetCodeXMLTag7.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# MD_CharacterSetCode')) # PARAMETERIZE
	MD_CharacterSetCodeXMLTag7.set('codeListValue', kwargs.get('', 'utf8')) # PARAMETERIZE
	parentIdentifierXMLTag8 = ET.SubElement(MD_MetadataXMLTag1, '{%s}parentIdentifier' % NS0)
	CharacterStringXMLTag9 = ET.SubElement(parentIdentifierXMLTag8, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag9.text = kwargs.get('', 'R_SARDEG: FZGFZ') # PARAMETERIZE
	hierarchyLevelXMLTag10 = ET.SubElement(MD_MetadataXMLTag1, '{%s}hierarchyLevel' % NS0)
	MD_ScopeCodeXMLTag11 = ET.SubElement(hierarchyLevelXMLTag10, '{%s}MD_ScopeCode' % NS0)
	MD_ScopeCodeXMLTag11.text = kwargs.get('', 'Servizio') # PARAMETERIZE
	MD_ScopeCodeXMLTag11.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# MD_ScopeCode')) # PARAMETERIZE
	MD_ScopeCodeXMLTag11.set('codeListValue', kwargs.get('', 'service')) # PARAMETERIZE
	contactXMLTag12 = ET.SubElement(MD_MetadataXMLTag1, '{%s}contact' % NS0)
	CI_ResponsiblePartyXMLTag13 = ET.SubElement(contactXMLTag12, '{%s}CI_ResponsibleParty' % NS0)
	organisationNameXMLTag14 = ET.SubElement(CI_ResponsiblePartyXMLTag13, '{%s}organisationName' % NS0)
	CharacterStringXMLTag15 = ET.SubElement(organisationNameXMLTag14, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag15.text = kwargs.get('', 'Servizio informativo e cartografico regionale - Regione Autonoma della Sardegna') # PARAMETERIZE
	contactInfoXMLTag16 = ET.SubElement(CI_ResponsiblePartyXMLTag13, '{%s}contactInfo' % NS0)
	CI_ContactXMLTag17 = ET.SubElement(contactInfoXMLTag16, '{%s}CI_Contact' % NS0)
	phoneXMLTag18 = ET.SubElement(CI_ContactXMLTag17, '{%s}phone' % NS0)
	CI_TelephoneXMLTag19 = ET.SubElement(phoneXMLTag18, '{%s}CI_Telephone' % NS0)
	voiceXMLTag20 = ET.SubElement(CI_TelephoneXMLTag19, '{%s}voice' % NS0)
	CharacterStringXMLTag21 = ET.SubElement(voiceXMLTag20, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag21.text = kwargs.get('', '+390706064325') # PARAMETERIZE
	addressXMLTag22 = ET.SubElement(CI_ContactXMLTag17, '{%s}address' % NS0)
	CI_AddressXMLTag23 = ET.SubElement(addressXMLTag22, '{%s}CI_Address' % NS0)
	electronicMailAddressXMLTag24 = ET.SubElement(CI_AddressXMLTag23, '{%s}electronicMailAddress' % NS0)
	CharacterStringXMLTag25 = ET.SubElement(electronicMailAddressXMLTag24, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag25.text = kwargs.get('', 'eell.urb.infocarto@regione.sardegna.it') # PARAMETERIZE
	onlineResourceXMLTag26 = ET.SubElement(CI_ContactXMLTag17, '{%s}onlineResource' % NS0)
	CI_OnlineResourceXMLTag27 = ET.SubElement(onlineResourceXMLTag26, '{%s}CI_OnlineResource' % NS0)
	linkageXMLTag28 = ET.SubElement(CI_OnlineResourceXMLTag27, '{%s}linkage' % NS0)
	URLXMLTag29 = ET.SubElement(linkageXMLTag28, '{%s}URL' % NS0)
	URLXMLTag29.text = kwargs.get('', 'http://www.sardegnaterritorio.it') # PARAMETERIZE
	roleXMLTag30 = ET.SubElement(CI_ResponsiblePartyXMLTag13, '{%s}role' % NS0)
	CI_RoleCodeXMLTag31 = ET.SubElement(roleXMLTag30, '{%s}CI_RoleCode' % NS0)
	CI_RoleCodeXMLTag31.text = kwargs.get('', 'Punto di contatto') # PARAMETERIZE
	CI_RoleCodeXMLTag31.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_RoleCode')) # PARAMETERIZE
	CI_RoleCodeXMLTag31.set('codeListValue', kwargs.get('', 'pointOfContact')) # PARAMETERIZE
	dateStampXMLTag32 = ET.SubElement(MD_MetadataXMLTag1, '{%s}dateStamp' % NS0)
	DateXMLTag33 = ET.SubElement(dateStampXMLTag32, '{%s}Date' % NS1)
	DateXMLTag33.text = kwargs.get('', '2009-07-28') # PARAMETERIZE
	metadataStandardNameXMLTag34 = ET.SubElement(MD_MetadataXMLTag1, '{%s}metadataStandardName' % NS0)
	CharacterStringXMLTag35 = ET.SubElement(metadataStandardNameXMLTag34, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag35.text = kwargs.get('', 'DM – Regole tecniche RNDT') # PARAMETERIZE
	metadataStandardVersionXMLTag36 = ET.SubElement(MD_MetadataXMLTag1, '{%s}metadataStandardVersion' % NS0)
	CharacterStringXMLTag37 = ET.SubElement(metadataStandardVersionXMLTag36, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag37.text = kwargs.get('', '10 novembre 2011') # PARAMETERIZE
	identificationInfoXMLTag38 = ET.SubElement(MD_MetadataXMLTag1, '{%s}identificationInfo' % NS0)
	SV_ServiceIdentificationXMLTag39 = ET.SubElement(identificationInfoXMLTag38, '{%s}SV_ServiceIdentification' % NS2)
	citationXMLTag40 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}citation' % NS0)
	CI_CitationXMLTag41 = ET.SubElement(citationXMLTag40, '{%s}CI_Citation' % NS0)
	titleXMLTag42 = ET.SubElement(CI_CitationXMLTag41, '{%s}title' % NS0)
	CharacterStringXMLTag43 = ET.SubElement(titleXMLTag42, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag43.text = kwargs.get('', 'Servizio WMS (Web Map Service) per le immagini della Regione Autonoma della Sardegna') # PARAMETERIZE
	dateXMLTag44 = ET.SubElement(CI_CitationXMLTag41, '{%s}date' % NS0)
	CI_DateXMLTag45 = ET.SubElement(dateXMLTag44, '{%s}CI_Date' % NS0)
	dateXMLTag46 = ET.SubElement(CI_DateXMLTag45, '{%s}date' % NS0)
	DateXMLTag47 = ET.SubElement(dateXMLTag46, '{%s}Date' % NS1)
	DateXMLTag47.text = kwargs.get('', '2007-01-01') # PARAMETERIZE
	dateTypeXMLTag48 = ET.SubElement(CI_DateXMLTag45, '{%s}dateType' % NS0)
	CI_DateTypeCodeXMLTag49 = ET.SubElement(dateTypeXMLTag48, '{%s}CI_DateTypeCode' % NS0)
	CI_DateTypeCodeXMLTag49.text = kwargs.get('', 'Pubblicazione') # PARAMETERIZE
	CI_DateTypeCodeXMLTag49.set('codeList', kwargs.get('', '..//resources/codelist/gmxCodelists.xml?CI_DateTypeCode')) # PARAMETERIZE
	CI_DateTypeCodeXMLTag49.set('codeListValue', kwargs.get('', 'publication')) # PARAMETERIZE
	dateXMLTag50 = ET.SubElement(CI_CitationXMLTag41, '{%s}date' % NS0)
	CI_DateXMLTag51 = ET.SubElement(dateXMLTag50, '{%s}CI_Date' % NS0)
	dateXMLTag52 = ET.SubElement(CI_DateXMLTag51, '{%s}date' % NS0)
	DateXMLTag53 = ET.SubElement(dateXMLTag52, '{%s}Date' % NS1)
	DateXMLTag53.text = kwargs.get('', '2007-01-01') # PARAMETERIZE
	dateTypeXMLTag54 = ET.SubElement(CI_DateXMLTag51, '{%s}dateType' % NS0)
	CI_DateTypeCodeXMLTag55 = ET.SubElement(dateTypeXMLTag54, '{%s}CI_DateTypeCode' % NS0)
	CI_DateTypeCodeXMLTag55.text = kwargs.get('', 'Creazione') # PARAMETERIZE
	CI_DateTypeCodeXMLTag55.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_DateTypeCode')) # PARAMETERIZE
	CI_DateTypeCodeXMLTag55.set('codeListValue', kwargs.get('', 'creation')) # PARAMETERIZE
	dateXMLTag56 = ET.SubElement(CI_CitationXMLTag41, '{%s}date' % NS0)
	CI_DateXMLTag57 = ET.SubElement(dateXMLTag56, '{%s}CI_Date' % NS0)
	dateXMLTag58 = ET.SubElement(CI_DateXMLTag57, '{%s}date' % NS0)
	DateXMLTag59 = ET.SubElement(dateXMLTag58, '{%s}Date' % NS1)
	DateXMLTag59.text = kwargs.get('', '2009-01-01') # PARAMETERIZE
	dateTypeXMLTag60 = ET.SubElement(CI_DateXMLTag57, '{%s}dateType' % NS0)
	CI_DateTypeCodeXMLTag61 = ET.SubElement(dateTypeXMLTag60, '{%s}CI_DateTypeCode' % NS0)
	CI_DateTypeCodeXMLTag61.text = kwargs.get('', 'Revisione') # PARAMETERIZE
	CI_DateTypeCodeXMLTag61.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_DateTypeCode')) # PARAMETERIZE
	CI_DateTypeCodeXMLTag61.set('codeListValue', kwargs.get('', 'revision')) # PARAMETERIZE
	identifierXMLTag62 = ET.SubElement(CI_CitationXMLTag41, '{%s}identifier' % NS0)
	RS_IdentifierXMLTag63 = ET.SubElement(identifierXMLTag62, '{%s}RS_Identifier' % NS0)
	codeXMLTag64 = ET.SubElement(RS_IdentifierXMLTag63, '{%s}code' % NS0)
	CharacterStringXMLTag65 = ET.SubElement(codeXMLTag64, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag65.text = kwargs.get('', 'R_SARDEG:PPLSF') # PARAMETERIZE
	citedResponsiblePartyXMLTag66 = ET.SubElement(CI_CitationXMLTag41, '{%s}citedResponsibleParty' % NS0)
	CI_ResponsiblePartyXMLTag67 = ET.SubElement(citedResponsiblePartyXMLTag66, '{%s}CI_ResponsibleParty' % NS0)
	organisationNameXMLTag68 = ET.SubElement(CI_ResponsiblePartyXMLTag67, '{%s}organisationName' % NS0)
	CharacterStringXMLTag69 = ET.SubElement(organisationNameXMLTag68, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag69.text = kwargs.get('', 'Servizio informativo e cartografico regionale - Regione Autonoma della Sardegna') # PARAMETERIZE
	contactInfoXMLTag70 = ET.SubElement(CI_ResponsiblePartyXMLTag67, '{%s}contactInfo' % NS0)
	CI_ContactXMLTag71 = ET.SubElement(contactInfoXMLTag70, '{%s}CI_Contact' % NS0)
	phoneXMLTag72 = ET.SubElement(CI_ContactXMLTag71, '{%s}phone' % NS0)
	CI_TelephoneXMLTag73 = ET.SubElement(phoneXMLTag72, '{%s}CI_Telephone' % NS0)
	voiceXMLTag74 = ET.SubElement(CI_TelephoneXMLTag73, '{%s}voice' % NS0)
	CharacterStringXMLTag75 = ET.SubElement(voiceXMLTag74, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag75.text = kwargs.get('', '+390706064325') # PARAMETERIZE
	addressXMLTag76 = ET.SubElement(CI_ContactXMLTag71, '{%s}address' % NS0)
	CI_AddressXMLTag77 = ET.SubElement(addressXMLTag76, '{%s}CI_Address' % NS0)
	electronicMailAddressXMLTag78 = ET.SubElement(CI_AddressXMLTag77, '{%s}electronicMailAddress' % NS0)
	CharacterStringXMLTag79 = ET.SubElement(electronicMailAddressXMLTag78, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag79.text = kwargs.get('', 'eell.urb.infocarto@regione.sardegna.it') # PARAMETERIZE
	onlineResourceXMLTag80 = ET.SubElement(CI_ContactXMLTag71, '{%s}onlineResource' % NS0)
	CI_OnlineResourceXMLTag81 = ET.SubElement(onlineResourceXMLTag80, '{%s}CI_OnlineResource' % NS0)
	linkageXMLTag82 = ET.SubElement(CI_OnlineResourceXMLTag81, '{%s}linkage' % NS0)
	URLXMLTag83 = ET.SubElement(linkageXMLTag82, '{%s}URL' % NS0)
	URLXMLTag83.text = kwargs.get('', 'http://www.sardegnaterritorio.it') # PARAMETERIZE
	roleXMLTag84 = ET.SubElement(CI_ResponsiblePartyXMLTag67, '{%s}role' % NS0)
	CI_RoleCodeXMLTag85 = ET.SubElement(roleXMLTag84, '{%s}CI_RoleCode' % NS0)
	CI_RoleCodeXMLTag85.text = kwargs.get('', 'Proprietario') # PARAMETERIZE
	CI_RoleCodeXMLTag85.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_RoleCode')) # PARAMETERIZE
	CI_RoleCodeXMLTag85.set('codeListValue', kwargs.get('', 'owner')) # PARAMETERIZE
	citedResponsiblePartyXMLTag86 = ET.SubElement(CI_CitationXMLTag41, '{%s}citedResponsibleParty' % NS0)
	CI_ResponsiblePartyXMLTag87 = ET.SubElement(citedResponsiblePartyXMLTag86, '{%s}CI_ResponsibleParty' % NS0)
	organisationNameXMLTag88 = ET.SubElement(CI_ResponsiblePartyXMLTag87, '{%s}organisationName' % NS0)
	CharacterStringXMLTag89 = ET.SubElement(organisationNameXMLTag88, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag89.text = kwargs.get('', 'Servizio informativo e cartografico regionale - Regione Autonoma della Sardegna') # PARAMETERIZE
	contactInfoXMLTag90 = ET.SubElement(CI_ResponsiblePartyXMLTag87, '{%s}contactInfo' % NS0)
	CI_ContactXMLTag91 = ET.SubElement(contactInfoXMLTag90, '{%s}CI_Contact' % NS0)
	phoneXMLTag92 = ET.SubElement(CI_ContactXMLTag91, '{%s}phone' % NS0)
	CI_TelephoneXMLTag93 = ET.SubElement(phoneXMLTag92, '{%s}CI_Telephone' % NS0)
	voiceXMLTag94 = ET.SubElement(CI_TelephoneXMLTag93, '{%s}voice' % NS0)
	CharacterStringXMLTag95 = ET.SubElement(voiceXMLTag94, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag95.text = kwargs.get('', '+390706064325') # PARAMETERIZE
	addressXMLTag96 = ET.SubElement(CI_ContactXMLTag91, '{%s}address' % NS0)
	CI_AddressXMLTag97 = ET.SubElement(addressXMLTag96, '{%s}CI_Address' % NS0)
	electronicMailAddressXMLTag98 = ET.SubElement(CI_AddressXMLTag97, '{%s}electronicMailAddress' % NS0)
	CharacterStringXMLTag99 = ET.SubElement(electronicMailAddressXMLTag98, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag99.text = kwargs.get('', 'eell.urb.infocarto@regione.sardegna.it') # PARAMETERIZE
	onlineResourceXMLTag100 = ET.SubElement(CI_ContactXMLTag91, '{%s}onlineResource' % NS0)
	CI_OnlineResourceXMLTag101 = ET.SubElement(onlineResourceXMLTag100, '{%s}CI_OnlineResource' % NS0)
	linkageXMLTag102 = ET.SubElement(CI_OnlineResourceXMLTag101, '{%s}linkage' % NS0)
	URLXMLTag103 = ET.SubElement(linkageXMLTag102, '{%s}URL' % NS0)
	URLXMLTag103.text = kwargs.get('', 'http://www.sardegnaterritorio.it') # PARAMETERIZE
	roleXMLTag104 = ET.SubElement(CI_ResponsiblePartyXMLTag87, '{%s}role' % NS0)
	CI_RoleCodeXMLTag105 = ET.SubElement(roleXMLTag104, '{%s}CI_RoleCode' % NS0)
	CI_RoleCodeXMLTag105.text = kwargs.get('', 'Editore') # PARAMETERIZE
	CI_RoleCodeXMLTag105.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_RoleCode')) # PARAMETERIZE
	CI_RoleCodeXMLTag105.set('codeListValue', kwargs.get('', 'publisher')) # PARAMETERIZE
	citedResponsiblePartyXMLTag106 = ET.SubElement(CI_CitationXMLTag41, '{%s}citedResponsibleParty' % NS0)
	CI_ResponsiblePartyXMLTag107 = ET.SubElement(citedResponsiblePartyXMLTag106, '{%s}CI_ResponsibleParty' % NS0)
	organisationNameXMLTag108 = ET.SubElement(CI_ResponsiblePartyXMLTag107, '{%s}organisationName' % NS0)
	CharacterStringXMLTag109 = ET.SubElement(organisationNameXMLTag108, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag109.text = kwargs.get('', 'Servizio informativo e cartografico regionale - Regione Autonoma della Sardegna') # PARAMETERIZE
	contactInfoXMLTag110 = ET.SubElement(CI_ResponsiblePartyXMLTag107, '{%s}contactInfo' % NS0)
	CI_ContactXMLTag111 = ET.SubElement(contactInfoXMLTag110, '{%s}CI_Contact' % NS0)
	phoneXMLTag112 = ET.SubElement(CI_ContactXMLTag111, '{%s}phone' % NS0)
	CI_TelephoneXMLTag113 = ET.SubElement(phoneXMLTag112, '{%s}CI_Telephone' % NS0)
	voiceXMLTag114 = ET.SubElement(CI_TelephoneXMLTag113, '{%s}voice' % NS0)
	CharacterStringXMLTag115 = ET.SubElement(voiceXMLTag114, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag115.text = kwargs.get('', '+390706064325') # PARAMETERIZE
	addressXMLTag116 = ET.SubElement(CI_ContactXMLTag111, '{%s}address' % NS0)
	CI_AddressXMLTag117 = ET.SubElement(addressXMLTag116, '{%s}CI_Address' % NS0)
	electronicMailAddressXMLTag118 = ET.SubElement(CI_AddressXMLTag117, '{%s}electronicMailAddress' % NS0)
	CharacterStringXMLTag119 = ET.SubElement(electronicMailAddressXMLTag118, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag119.text = kwargs.get('', 'eell.urb.infocarto@regione.sardegna.it') # PARAMETERIZE
	onlineResourceXMLTag120 = ET.SubElement(CI_ContactXMLTag111, '{%s}onlineResource' % NS0)
	CI_OnlineResourceXMLTag121 = ET.SubElement(onlineResourceXMLTag120, '{%s}CI_OnlineResource' % NS0)
	linkageXMLTag122 = ET.SubElement(CI_OnlineResourceXMLTag121, '{%s}linkage' % NS0)
	URLXMLTag123 = ET.SubElement(linkageXMLTag122, '{%s}URL' % NS0)
	URLXMLTag123.text = kwargs.get('', 'http://www.sardegnaterritorio.it') # PARAMETERIZE
	roleXMLTag124 = ET.SubElement(CI_ResponsiblePartyXMLTag107, '{%s}role' % NS0)
	CI_RoleCodeXMLTag125 = ET.SubElement(roleXMLTag124, '{%s}CI_RoleCode' % NS0)
	CI_RoleCodeXMLTag125.text = kwargs.get('', 'Autore') # PARAMETERIZE
	CI_RoleCodeXMLTag125.set('codeList', kwargs.get('', 'ttp://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_RoleCode')) # PARAMETERIZE
	CI_RoleCodeXMLTag125.set('codeListValue', kwargs.get('', 'author')) # PARAMETERIZE
	abstractXMLTag126 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}abstract' % NS0)
	CharacterStringXMLTag127 = ET.SubElement(abstractXMLTag126, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag127.text = kwargs.get('', 'Il servizio WMS (Web Map Service) permette di visualizzare le cartografie che la Regione Autonoma della Sardegna mette a disposizione all\'interno del Sistema Informativo Territoriale Regionale.') # PARAMETERIZE
	pointOfContactXMLTag128 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}pointOfContact' % NS0)
	CI_ResponsiblePartyXMLTag129 = ET.SubElement(pointOfContactXMLTag128, '{%s}CI_ResponsibleParty' % NS0)
	organisationNameXMLTag130 = ET.SubElement(CI_ResponsiblePartyXMLTag129, '{%s}organisationName' % NS0)
	CharacterStringXMLTag131 = ET.SubElement(organisationNameXMLTag130, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag131.text = kwargs.get('', 'Servizio informativo e cartografico regionale - Regione Autonoma della Sardegna') # PARAMETERIZE
	contactInfoXMLTag132 = ET.SubElement(CI_ResponsiblePartyXMLTag129, '{%s}contactInfo' % NS0)
	CI_ContactXMLTag133 = ET.SubElement(contactInfoXMLTag132, '{%s}CI_Contact' % NS0)
	phoneXMLTag134 = ET.SubElement(CI_ContactXMLTag133, '{%s}phone' % NS0)
	CI_TelephoneXMLTag135 = ET.SubElement(phoneXMLTag134, '{%s}CI_Telephone' % NS0)
	voiceXMLTag136 = ET.SubElement(CI_TelephoneXMLTag135, '{%s}voice' % NS0)
	CharacterStringXMLTag137 = ET.SubElement(voiceXMLTag136, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag137.text = kwargs.get('', '+390706064325') # PARAMETERIZE
	addressXMLTag138 = ET.SubElement(CI_ContactXMLTag133, '{%s}address' % NS0)
	CI_AddressXMLTag139 = ET.SubElement(addressXMLTag138, '{%s}CI_Address' % NS0)
	electronicMailAddressXMLTag140 = ET.SubElement(CI_AddressXMLTag139, '{%s}electronicMailAddress' % NS0)
	CharacterStringXMLTag141 = ET.SubElement(electronicMailAddressXMLTag140, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag141.text = kwargs.get('', 'eell.urb.infocarto@regione.sardegna.it') # PARAMETERIZE
	onlineResourceXMLTag142 = ET.SubElement(CI_ContactXMLTag133, '{%s}onlineResource' % NS0)
	CI_OnlineResourceXMLTag143 = ET.SubElement(onlineResourceXMLTag142, '{%s}CI_OnlineResource' % NS0)
	linkageXMLTag144 = ET.SubElement(CI_OnlineResourceXMLTag143, '{%s}linkage' % NS0)
	URLXMLTag145 = ET.SubElement(linkageXMLTag144, '{%s}URL' % NS0)
	URLXMLTag145.text = kwargs.get('', 'http://www.sardegnaterritorio.it') # PARAMETERIZE
	roleXMLTag146 = ET.SubElement(CI_ResponsiblePartyXMLTag129, '{%s}role' % NS0)
	CI_RoleCodeXMLTag147 = ET.SubElement(roleXMLTag146, '{%s}CI_RoleCode' % NS0)
	CI_RoleCodeXMLTag147.text = kwargs.get('', 'Punto di contatto') # PARAMETERIZE
	CI_RoleCodeXMLTag147.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_RoleCode')) # PARAMETERIZE
	CI_RoleCodeXMLTag147.set('codeListValue', kwargs.get('', 'pointOfContact')) # PARAMETERIZE
	descriptiveKeywordsXMLTag148 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}descriptiveKeywords' % NS0)
	MD_KeywordsXMLTag149 = ET.SubElement(descriptiveKeywordsXMLTag148, '{%s}MD_Keywords' % NS0)
	keywordXMLTag150 = ET.SubElement(MD_KeywordsXMLTag149, '{%s}keyword' % NS0)
	CharacterStringXMLTag151 = ET.SubElement(keywordXMLTag150, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag151.text = kwargs.get('', 'infoMapAccessService') # PARAMETERIZE
	resourceConstraintsXMLTag152 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}resourceConstraints' % NS0)
	MD_ConstraintsXMLTag153 = ET.SubElement(resourceConstraintsXMLTag152, '{%s}MD_Constraints' % NS0)
	useLimitationXMLTag154 = ET.SubElement(MD_ConstraintsXMLTag153, '{%s}useLimitation' % NS0)
	CharacterStringXMLTag155 = ET.SubElement(useLimitationXMLTag154, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag155.text = kwargs.get('', 'nessuna limitazione') # PARAMETERIZE
	resourceConstraintsXMLTag156 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}resourceConstraints' % NS0)
	MD_LegalConstraintsXMLTag157 = ET.SubElement(resourceConstraintsXMLTag156, '{%s}MD_LegalConstraints' % NS0)
	accessConstraintsXMLTag158 = ET.SubElement(MD_LegalConstraintsXMLTag157, '{%s}accessConstraints' % NS0)
	MD_RestrictionCodeXMLTag159 = ET.SubElement(accessConstraintsXMLTag158, '{%s}MD_RestrictionCode' % NS0)
	MD_RestrictionCodeXMLTag159.text = kwargs.get('', 'altri vincoli') # PARAMETERIZE
	MD_RestrictionCodeXMLTag159.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_RestrictionCode')) # PARAMETERIZE
	MD_RestrictionCodeXMLTag159.set('codeListValue', kwargs.get('', 'otherRestrictions')) # PARAMETERIZE
	useConstraintsXMLTag160 = ET.SubElement(MD_LegalConstraintsXMLTag157, '{%s}useConstraints' % NS0)
	MD_RestrictionCodeXMLTag161 = ET.SubElement(useConstraintsXMLTag160, '{%s}MD_RestrictionCode' % NS0)
	MD_RestrictionCodeXMLTag161.text = kwargs.get('', 'altri vincoli') # PARAMETERIZE
	MD_RestrictionCodeXMLTag161.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_RestrictionCode')) # PARAMETERIZE
	MD_RestrictionCodeXMLTag161.set('codeListValue', kwargs.get('', 'otherRestrictions')) # PARAMETERIZE
	otherConstraintsXMLTag162 = ET.SubElement(MD_LegalConstraintsXMLTag157, '{%s}otherConstraints' % NS0)
	CharacterStringXMLTag163 = ET.SubElement(otherConstraintsXMLTag162, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag163.text = kwargs.get('', 'Dato pubblico (cfr. art. 1 Codice Amministrazione Digitale)') # PARAMETERIZE
	resourceConstraintsXMLTag164 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}resourceConstraints' % NS0)
	MD_SecurityConstraintsXMLTag165 = ET.SubElement(resourceConstraintsXMLTag164, '{%s}MD_SecurityConstraints' % NS0)
	classificationXMLTag166 = ET.SubElement(MD_SecurityConstraintsXMLTag165, '{%s}classification' % NS0)
	MD_ClassificationCodeXMLTag167 = ET.SubElement(classificationXMLTag166, '{%s}MD_ClassificationCode' % NS0)
	MD_ClassificationCodeXMLTag167.text = kwargs.get('', 'Non classificato') # PARAMETERIZE
	MD_ClassificationCodeXMLTag167.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# MD_ClassificationCode')) # PARAMETERIZE
	MD_ClassificationCodeXMLTag167.set('codeListValue', kwargs.get('', 'unclassified')) # PARAMETERIZE
	serviceTypeXMLTag168 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}serviceType' % NS2)
	LocalNameXMLTag169 = ET.SubElement(serviceTypeXMLTag168, '{%s}LocalName' % NS1)
	LocalNameXMLTag169.text = kwargs.get('', 'view') # PARAMETERIZE
	extentXMLTag170 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}extent' % NS2)
	EX_ExtentXMLTag171 = ET.SubElement(extentXMLTag170, '{%s}EX_Extent' % NS0)
	geographicElementXMLTag172 = ET.SubElement(EX_ExtentXMLTag171, '{%s}geographicElement' % NS0)
	EX_GeographicBoundingBoxXMLTag173 = ET.SubElement(geographicElementXMLTag172, '{%s}EX_GeographicBoundingBox' % NS0)
	westBoundLongitudeXMLTag174 = ET.SubElement(EX_GeographicBoundingBoxXMLTag173, '{%s}westBoundLongitude' % NS0)
	DecimalXMLTag175 = ET.SubElement(westBoundLongitudeXMLTag174, '{%s}Decimal' % NS1)
	DecimalXMLTag175.text = kwargs.get('', '7.96') # PARAMETERIZE
	eastBoundLongitudeXMLTag176 = ET.SubElement(EX_GeographicBoundingBoxXMLTag173, '{%s}eastBoundLongitude' % NS0)
	DecimalXMLTag177 = ET.SubElement(eastBoundLongitudeXMLTag176, '{%s}Decimal' % NS1)
	DecimalXMLTag177.text = kwargs.get('', '10.08') # PARAMETERIZE
	southBoundLatitudeXMLTag178 = ET.SubElement(EX_GeographicBoundingBoxXMLTag173, '{%s}southBoundLatitude' % NS0)
	DecimalXMLTag179 = ET.SubElement(southBoundLatitudeXMLTag178, '{%s}Decimal' % NS1)
	DecimalXMLTag179.text = kwargs.get('', '38.75') # PARAMETERIZE
	northBoundLatitudeXMLTag180 = ET.SubElement(EX_GeographicBoundingBoxXMLTag173, '{%s}northBoundLatitude' % NS0)
	DecimalXMLTag181 = ET.SubElement(northBoundLatitudeXMLTag180, '{%s}Decimal' % NS1)
	DecimalXMLTag181.text = kwargs.get('', '41.46') # PARAMETERIZE
	couplingTypeXMLTag182 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}couplingType' % NS2)
	SV_CouplingTypeXMLTag183 = ET.SubElement(couplingTypeXMLTag182, '{%s}SV_CouplingType' % NS2)
	SV_CouplingTypeXMLTag183.text = kwargs.get('', 'vincolato') # PARAMETERIZE
	SV_CouplingTypeXMLTag183.set('codeList', kwargs.get('', '#SvCouplingType')) # PARAMETERIZE
	SV_CouplingTypeXMLTag183.set('codeListValue', kwargs.get('', 'tight')) # PARAMETERIZE
	containsOperationsXMLTag184 = ET.SubElement(SV_ServiceIdentificationXMLTag39, '{%s}containsOperations' % NS2)
	SV_OperationMetadataXMLTag185 = ET.SubElement(containsOperationsXMLTag184, '{%s}SV_OperationMetadata' % NS2)
	operationNameXMLTag186 = ET.SubElement(SV_OperationMetadataXMLTag185, '{%s}operationName' % NS2)
	CharacterStringXMLTag187 = ET.SubElement(operationNameXMLTag186, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag187.text = kwargs.get('', 'GetCapabilities') # PARAMETERIZE
	DCPXMLTag188 = ET.SubElement(SV_OperationMetadataXMLTag185, '{%s}DCP' % NS2)
	DCPListXMLTag189 = ET.SubElement(DCPXMLTag188, '{%s}DCPList' % NS2)
	DCPListXMLTag189.text = kwargs.get('', 'WebServices') # PARAMETERIZE
	DCPListXMLTag189.set('codeList', kwargs.get('', '#DCPList')) # PARAMETERIZE
	DCPListXMLTag189.set('codeListValue', kwargs.get('', 'WebServices')) # PARAMETERIZE
	connectPointXMLTag190 = ET.SubElement(SV_OperationMetadataXMLTag185, '{%s}connectPoint' % NS2)
	CI_OnlineResourceXMLTag191 = ET.SubElement(connectPointXMLTag190, '{%s}CI_OnlineResource' % NS0)
	linkageXMLTag192 = ET.SubElement(CI_OnlineResourceXMLTag191, '{%s}linkage' % NS0)
	URLXMLTag193 = ET.SubElement(linkageXMLTag192, '{%s}URL' % NS0)
	URLXMLTag193.text = kwargs.get('', 'http://webgis.regione.sardegna.it/wmsconnector/com.esri.wms.Esrimap/ras_wms?service=WMS&request=GetCapabilities') # PARAMETERIZE
	dataQualityInfoXMLTag194 = ET.SubElement(MD_MetadataXMLTag1, '{%s}dataQualityInfo' % NS0)
	DQ_DataQualityXMLTag195 = ET.SubElement(dataQualityInfoXMLTag194, '{%s}DQ_DataQuality' % NS0)
	scopeXMLTag196 = ET.SubElement(DQ_DataQualityXMLTag195, '{%s}scope' % NS0)
	DQ_ScopeXMLTag197 = ET.SubElement(scopeXMLTag196, '{%s}DQ_Scope' % NS0)
	levelXMLTag198 = ET.SubElement(DQ_ScopeXMLTag197, '{%s}level' % NS0)
	MD_ScopeCodeXMLTag199 = ET.SubElement(levelXMLTag198, '{%s}MD_ScopeCode' % NS0)
	MD_ScopeCodeXMLTag199.text = kwargs.get('', 'Servizio') # PARAMETERIZE
	MD_ScopeCodeXMLTag199.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# MD_ScopeCode')) # PARAMETERIZE
	MD_ScopeCodeXMLTag199.set('codeListValue', kwargs.get('', 'service')) # PARAMETERIZE
	reportXMLTag200 = ET.SubElement(DQ_DataQualityXMLTag195, '{%s}report' % NS0)
	DQ_DomainConsistencyXMLTag201 = ET.SubElement(reportXMLTag200, '{%s}DQ_DomainConsistency' % NS0)
	resultXMLTag202 = ET.SubElement(DQ_DomainConsistencyXMLTag201, '{%s}result' % NS0)
	DQ_ConformanceResultXMLTag203 = ET.SubElement(resultXMLTag202, '{%s}DQ_ConformanceResult' % NS0)
	specificationXMLTag204 = ET.SubElement(DQ_ConformanceResultXMLTag203, '{%s}specification' % NS0)
	CI_CitationXMLTag205 = ET.SubElement(specificationXMLTag204, '{%s}CI_Citation' % NS0)
	titleXMLTag206 = ET.SubElement(CI_CitationXMLTag205, '{%s}title' % NS0)
	CharacterStringXMLTag207 = ET.SubElement(titleXMLTag206, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag207.text = kwargs.get('', 'Service Abstract Test Suite') # PARAMETERIZE
	dateXMLTag208 = ET.SubElement(CI_CitationXMLTag205, '{%s}date' % NS0)
	CI_DateXMLTag209 = ET.SubElement(dateXMLTag208, '{%s}CI_Date' % NS0)
	dateXMLTag210 = ET.SubElement(CI_DateXMLTag209, '{%s}date' % NS0)
	DateXMLTag211 = ET.SubElement(dateXMLTag210, '{%s}Date' % NS1)
	DateXMLTag211.text = kwargs.get('', '2007-11-21') # PARAMETERIZE
	dateTypeXMLTag212 = ET.SubElement(CI_DateXMLTag209, '{%s}dateType' % NS0)
	CI_DateTypeCodeXMLTag213 = ET.SubElement(dateTypeXMLTag212, '{%s}CI_DateTypeCode' % NS0)
	CI_DateTypeCodeXMLTag213.text = kwargs.get('', 'Pubblicazione') # PARAMETERIZE
	CI_DateTypeCodeXMLTag213.set('codeList', kwargs.get('', 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/ML_gmxCodelists.xml# CI_DateTypeCode')) # PARAMETERIZE
	CI_DateTypeCodeXMLTag213.set('codeListValue', kwargs.get('', 'publication')) # PARAMETERIZE
	explanationXMLTag214 = ET.SubElement(DQ_ConformanceResultXMLTag203, '{%s}explanation' % NS0)
	CharacterStringXMLTag215 = ET.SubElement(explanationXMLTag214, '{%s}CharacterString' % NS1)
	CharacterStringXMLTag215.text = kwargs.get('', 'Non richiesto') # PARAMETERIZE
	passXMLTag216 = ET.SubElement(DQ_ConformanceResultXMLTag203, '{%s}pass' % NS0)
	return ET.tostring(MD_MetadataXMLTag1)

if __name__ == '__main__': print build()