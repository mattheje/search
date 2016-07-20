<?php
/**
*               Class to call CSOD REST API Functions
*               
*Requirements:  This class requires PHP 5 >= 5.1.2 
                and that 'php_xmlrpc' and 'php_curl' are installed on 
*               the system and enabled as extensions in the php.ini file.          
*  Created By:  Matthew Jensen
*Created Date:  07-JUL-2016
*     Purpose:  A re-usable class to easily call CSOD REST API functions and
*               abstract the ugly CSOD authentication and session calls.
*       Notes:  Please see example usage in commented out section at bottom of this 
*               file. 
*       TO DO:  1.) Maybe put CSOD REST API global settings in a config or ini file.
*      Update:  01-JAN-1979 - Matthew Jensen
*      Reason:  Initial Release
*/
class CSODRestAPI {
	protected $csodGlobals = array('proxyToUse'               => '135.245.192.6:8000', //Default DMZ proxy server.  Please make sure this is set correctly.
                                       /* PILOT CSOD Credentials */
                                       'baseRestServerURL'        => 'https://alcatel-lucent-pilot.csod.com',
                                       'csodApiID'                => '1s91aj4x8n530',
                                       'csodApiSecret'            => 'DnVqsNNE0UXnKGT9qCguugMuykr20aL0zNv+gvOWpbCEgnP+DC5aLVhiFX3wmt5IrA3r+34Ws+QG7YuVTDBdAw==',
                                       /* PRODUCTION CSOD Credentials TBD */
                                       'csodSessionRestURI'       => '/services/api/sts/session',  //CASE SENSITIVE!!!
                                       'csodCatalogSearchRestURI' => '/services/api/Catalog/GlobalSearch',  //CASE SENSITIVE!!!
			               'csodDefaultContentType'   => 'text/xml;charset=UTF-8'
                                 );
        protected $csodSessionToken = null;
        protected $csodSessionTokenExpires = null;

	/***********************
	 * PUBLIC FUNCTIONS    *
	***********************/
	public function getCsodGlobals() {
		return $this->csodGlobals;
	} //end function getSpGlobals

	public function getCsodSessionToken() {
		return $this->csodSessionToken;
	} //end function getCsodSessionToken
	
	public function getCsodSessionTokenExpires() {
		return $this->csodSessionTokenExpires;
	} //end function getCsodSessionTokenExpires
	
	public function setCsodSessionToken(array $token) {
		if(is_array($token) && trim($token['id']))
			$this->csodSessionToken = $token;
	} //end function setCsodSessionToken
		
	public function setCsodSessionTokenExpires($date) {
		$this->csodSessionTokenExpires = $date;
	} //end function setCsodSessionTokenExpires

} //end class CSODRestAPI